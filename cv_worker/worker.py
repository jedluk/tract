import numpy as np
import sys
import cv2
import random
import logging
from os import getenv, path


def get_base_path():
    mode = getenv('MODE', 'development')
    prefix = '..' if mode == 'development' else '.'
    return path.abspath(path.join(prefix, 'assets'))


# TODO: fully migrate to logger
class ImagePainter:
    R_CHANNEL, G_CHANNEL, B_CHANNEL = (0, 1, 2)
    DEV_MODE, LOGGING = (0, 0)
    CLUSTERING = 1

    def __init__(self, color, gray, out_path, n, save_gray):
        self.colorImg = cv2.cvtColor(cv2.imread(color), cv2.COLOR_BGR2RGB)
        self.grayImg = cv2.imread(gray)
        self.outImgPath = out_path
        gray_height, gray_width, gray_channels = self.grayImg.shape
        if gray_channels == 3:
            self.grayImg = cv2.cvtColor(self.grayImg, cv2.COLOR_BGR2GRAY)
        if save_gray:
            cv2.imwrite('gray.jpg', self.grayImg)
        self.outImg = np.zeros([save_gray, gray_width, 3])
        self.clusters = int(n)
        self.estimatedColors = np.zeros([self.clusters, 3])
        self.grayThresholds = np.zeros(self.clusters)
        if not self.CLUSTERING:
            color_height, color_width = (
                self.colorImg.shape[0], self.colorImg.shape[1])
            self.blurImg = None
            self.samples = int(0.01 * color_height * color_width)
            self.colorThresholds = np.zeros(self.clusters)

    def find_colors_by_clustering(self):
        processed_image = self.colorImg
        processed_image = processed_image.reshape((-1, 3))
        processed_image = np.float32(processed_image)
        criteria = (cv2.TERM_CRITERIA_EPS +
                    cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
        K = self.clusters
        centers = cv2.kmeans(processed_image, K, criteria, 10, 0)[2]
        # centers = cv2.kmeans(processingImage,K,None,criteria,10,cv2.KMEANS_RANDOM_CENTERS)[2]
        self.estimatedColors = centers
        if self.DEV_MODE:
            print(self.estimatedColors)

    def find_color_thresholds(self, use_blur=False):
        height, width = (self.colorImg.shape[0], self.colorImg.shape[1])
        processing_image = self.colorImg
        if use_blur:
            processing_image = cv2.blur(self.colorImg, (10, 10))
            self.blurImg = processing_image
        cum_hist = np.zeros([height, width])
        for x in range(0, height):
            for y in range(0, width):
                r_value = int(processing_image[x, y, self.B_CHANNEL])
                g_value = int(processing_image[x, y, self.G_CHANNEL])
                b_value = int(processing_image[x, y, self.R_CHANNEL])
                cum_hist[[x], [y]] = r_value + g_value + b_value

        cum_hist_vec_sort = np.sort(cum_hist.flatten())
        self.colorThresholds = self.calculate_color_individuals(
            cum_hist_vec_sort)
        if self.DEV_MODE:
            print('color thresholds {}'.format(self.colorThresholds))

    # think about minimal variance spread
    def calculate_color_individuals(self, sorted_hist, use_mean=False):
        spread = int(len(sorted_hist) / self.clusters)
        thresholds = np.zeros(self.clusters)
        for i in range(0, self.clusters):
            lower_band = i * spread
            upper_band = (i + 1) * spread
            if use_mean:
                thresholds[i] = int(
                    np.mean(sorted_hist[lower_band:upper_band]))
            else:
                thresholds[i] = np.median(sorted_hist[lower_band:upper_band])
        return thresholds

    # randomly pick samples to estimate color being equivalent to threshold - quasi Monte Carlo method
    def find_color_triples(self):
        if not (self.blurImg is None):
            img = self.blurImg
        else:
            img = self.colorImg
        height, width = (img.shape[0], img.shape[1])
        # r,g,b + clusterId
        classified_pixels = np.zeros((self.samples, 4))
        for sample in range(0, self.samples):
            r = img[random.randint(0, height - 1),
                    random.randint(0, width - 1), self.R_CHANNEL]
            b = img[random.randint(0, height - 1),
                    random.randint(0, width - 1), self.B_CHANNEL]
            g = img[random.randint(0, height - 1),
                    random.randint(0, width - 1), self.G_CHANNEL]
            color = int(r) + int(g) + int(b)
            cluster_id = np.argmin([abs(threshold - color)
                                    for threshold in self.colorThresholds])
            classified_pixels[sample] = [r, g, b, cluster_id]

        self.estimatedColors = self.find_color_individuals(classified_pixels)
        if self.DEV_MODE:
            # print(classifiedPixels)
            print('estimated Colors: \n{}'.format(self.estimatedColors))

    def find_color_individuals(self, classified_pixels, use_mean=False):
        cluster_index = 3
        colors = np.zeros([self.clusters, 3])
        for index in range(0, self.clusters):
            if use_mean:
                triple = np.mean(
                    classified_pixels[classified_pixels[:, cluster_index] == index], axis=0)
            else:
                triple = np.median(
                    classified_pixels[classified_pixels[:, cluster_index] == index], axis=0)
            colors[index] = triple[:cluster_index]
        return colors

    def color_gray_image(self, save=True):
        height, width = (self.grayImg.shape[0], self.grayImg.shape[1])
        out_img = np.zeros([height, width, 3])
        self.grayThresholds = np.arange(
            int(255 / self.clusters), 256, int(255 / self.clusters))
        if self.LOGGING:
            file = open('logs.txt', 'w')
            self.grayThresholds.tofile(file, " ")
        for x in range(0, height):
            for y in range(0, width):
                intensity = self.grayImg[x, y]
                idx = self.clusters - 1
                for index in range(0, self.clusters):
                    if self.grayThresholds[index] - intensity >= 0:
                        idx = index
                        break
                if self.LOGGING:
                    file.write(
                        "intensity {}\tclass {}\t diffs\t".format(intensity, idx))
                    # diffs.tofile(file,sep=", ")
                    file.write("\n")
                out_img[[x], [y], self.B_CHANNEL] = self.estimatedColors[idx, 0]
                out_img[[x], [y], self.G_CHANNEL] = self.estimatedColors[idx, 1]
                out_img[[x], [y], self.R_CHANNEL] = self.estimatedColors[idx, 2]
        if self.DEV_MODE:
            file.close()
        self.outImg = out_img
        if save:
            base_path = get_base_path()
            cv2.imwrite(base_path, self.outImg)
            logging.info(f"image {self.outImg} saved")


def process_image(**kwargs):
    required_args = ['inputColor', 'inputGray', 'outImg']
    if not all([k in kwargs.keys() for k in required_args]):
        raise AssertionError(
            f"missing arguments !!! {', '.join(required_args)} must be provided")
    input_color, input_gray, out_img, clusters = None, None, None, 10

    base_path = get_base_path()
    for key, value in kwargs.items():
        if key == 'inputColor':
            input_color = path.abspath(path.join(base_path, value))
        elif key == 'inputGray':
            input_gray = path.abspath(path.join(base_path, value))
        elif key == 'N':
            try:
                clusters = int(value)
            except ValueError:
                pass
        elif key == 'outImg':
            out_img = value
    logging.info(
        f"real values: \n\tinput_color={input_color}\n\tinput_gray={input_gray}\n\tout_img={out_img}\n\tclusters={clusters}")
    # explicitly show we want to use clustering
    ImagePainter.CLUSTERING = 1
    ImagePainter.DEV_MODE = 0
    image_painter = ImagePainter(
        input_color, input_gray, out_img, clusters, False)
    if 1 == ImagePainter.CLUSTERING:
        image_painter.find_colors_by_clustering()
        image_painter.color_gray_image()
    else:
        image_painter.find_color_thresholds()
        image_painter.find_color_triples()
        image_painter.color_gray_image()


if __name__ == "__main__":
    if len(sys.argv) < 3:
        raise AssertionError("Insufficient arguments")
    else:
        process_image(**dict(arg.split('=') for arg in sys.argv[1:]))
