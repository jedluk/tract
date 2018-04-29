import numpy as np
import sys
import cv2
import math
import random
import matplotlib.pyplot as plt

class ImagePainter:
    R_CHANNEL, G_CHANNEL, B_CHANNEL = (0, 1, 2)
    DEV_MODE = 0

    def __init__(self, color, gray, N):
        self.colorImg = cv2.cvtColor(cv2.imread(color), cv2.COLOR_BGR2RGB)
        self.grayImg = cv2.imread(gray)
        grayHeight, grayWidth, grayChannels = self.grayImg.shape
        if grayChannels == 3:
            self.grayImg = cv2.cvtColor(self.grayImg, cv2.COLOR_BGR2GRAY)
        self.outImg = np.zeros([grayHeight, grayWidth, 3])
        self.blurImg = None
        self.clusters = N
        self.estimatedColors = np.zeros([self.clusters,3])
        colorHeight, colorWidth = (self.colorImg.shape[0], self.colorImg.shape[1])
        self.samples = int(0.1 * colorHeight * colorWidth)
        self.colorThresholds = np.zeros(self.clusters)
        self.grayThresholds = np.zeros(self.clusters)

    def findColorThresholds(self, useBlur=False):
        heigth, width = (self.colorImg.shape[0], self.colorImg.shape[1])
        processingImage = self.colorImg
        if useBlur:
            processingImage = cv2.blur(self.colorImg, (5, 5))
            self.blurImg = processingImage
        cumHist = np.zeros([heigth, width])
        for x in range(0, heigth):
            for y in range(0, width):
                R_value = 256**2 * int(processingImage[x, y, self.B_CHANNEL])
                G_value = 256 * int(processingImage[x, y, self.G_CHANNEL])
                B_value = int(processingImage[x, y, self.R_CHANNEL])
                cumHist[[x], [y]] = R_value + B_value + G_value

        cumHistVecSort = np.sort(cumHist.flatten())
        self.colorThresholds = self.calculateColorIndividuals(cumHistVecSort)
        if self.DEV_MODE:
            print('color thresholds {}'.format(self.colorThresholds))
    
    # think about minimal variance spread
    def calculateColorIndividuals(self, sortedHist, useMean=False):
        spread = int(len(sortedHist) / self.clusters) 
        thresholds = np.zeros(self.clusters)
        for i in range(0, self.clusters):
            lowerBand = i * spread
            upperBand = (i+1) * spread
            if useMean:
                thresholds[i] = int(np.mean(sortedHist[lowerBand:upperBand]))
            else:
                thresholds[i] = np.median(sortedHist[lowerBand:upperBand])
        return thresholds
    
    # randomly pick samples to estimate color being equivalent to threshold - quasi Monte Carlo method
    def findColorTriples(self):
        img = self.blurImg if self.blurImg != None else self.colorImg
        heigth, width = (img.shape[0], img.shape[1])
        # r,g,b + clusterId
        classifiedPixels = np.zeros((self.samples, 4)) 
        for sample in range(0, self.samples):
            r = img[random.randint(0, heigth - 1), random.randint(0, width - 1), self.R_CHANNEL]
            b = img[random.randint(0, heigth - 1), random.randint(0, width - 1), self.B_CHANNEL]
            g = img[random.randint(0, heigth - 1), random.randint(0, width - 1), self.G_CHANNEL]
            color = int(256**2 * r) + int(256 * g) + int(b)
            clusterId = np.argmin([abs(threshold - color) for threshold in self.colorThresholds ])
            classifiedPixels[(sample)] = [r,g,b,clusterId]

        self.estimatedColors = self.findColorIndividuals(classifiedPixels)
        if self.DEV_MODE:
            # print(classifiedPixels)
            print('estimated Colors: \n{}'.format(self.estimatedColors))

    def findColorIndividuals(self, classifiedPixels, useMean=False):
        CLUSTER_INDEX = 3
        colors = np.zeros([self.clusters,3])
        for index in range(0, self.clusters):
            if useMean:
                triple = np.mean(classifiedPixels[classifiedPixels[:, CLUSTER_INDEX] == index], axis=0)
            else:
                triple = np.median(classifiedPixels[classifiedPixels[:, CLUSTER_INDEX] == index], axis=0)
            colors[(index)] = triple[:3]
        return colors

    def colorGrayImage(self, save=True):
        height, width = (self.grayImg.shape[0], self.grayImg.shape[1])
        outImg = np.zeros([height, width, 3])
        # intensity = 0.2989*RED + 0.5870*GREEN + 0.1140*BLUE 
        file = open('results.txt','w')
        for x in range(0,height):
            for y in range(0,width):
                intensity = self.grayImg[x,y]
                file.write("intensity {}\t".format(intensity))
                idx = None
                diffs = np.zeros(self.clusters)
                index = 0
                for color in self.estimatedColors:
                    diff = abs(intensity -  (int(0.29 * color[0]) + int(0.58 * color[1]) + int(0.11 * color[2])))
                    diffs[index] = diff
                    index = index + 1
                idx = np.argmin(diffs)
                file.write("class{}\t".format(idx))
                file.write("diffs\t")
                diffs.tofile(file,sep=", ")
                file.write("\n")
                # idx = np.argmin([abs(intensity - (0.29 * pixel[0] + 0.58 * pixel[1] + 0.11 * pixel[2])) for pixel in self.estimatedColors])
                outImg[[x], [y], self.B_CHANNEL] = self.estimatedColors[idx, 0]
                outImg[[x], [y], self.G_CHANNEL] = self.estimatedColors[idx, 1]
                outImg[[x], [y], self.R_CHANNEL] = self.estimatedColors[idx, 2]
        file.close()
        self.outImg = outImg
        if save:
            cv2.imwrite('colored.jpg', self.outImg)
            print("image saved")
                
def main(**kwargs):
    inputColor, inputGray, clusters = (None, None, 5)
    for key, value in kwargs.items():
        if key == 'inputColor':
            inputColor = value
        elif key == 'inputGray':
            inputGray = value
        elif key == '':
            clusters = value
    ImagePainter.DEV_MODE = 1
    imagePainter = ImagePainter(inputColor, inputGray, clusters)
    imagePainter.findColorThresholds()
    imagePainter.findColorTriples()
    imagePainter.colorGrayImage()


if __name__ == "__main__":
    if len(sys.argv) < 3:
        raise SyntaxError("Insufficient arguments")
    else:
        main(**dict(arg.split('=') for arg in sys.argv[1:]))
