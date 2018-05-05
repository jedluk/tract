import numpy as np
import cv2
import Model
import math

class Generator:
    def __init__(self):
        self.model = Model.Model()
        self.model.Load()
        self.ResetParameters()
        self.generated = None

    def Close(self):
        self.model.Close()

    def ResetParameters(self):
        self.t = 1
        self.m1 = 0
        self.m2 = 0

    def GenerateNoise(self, a, b):
        return np.random.random_sample((224, 224, 3))*a+b
    
    def LoadImageColor(self, image, bgr):
        if bgr:
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image = cv2.resize(image, (224,224))
        return image
    
    def LoadImageGray(self, image):
        image = cv2.resize(image, (224,224))
        image = np.tile(np.expand_dims(image, 2), [1,1,3])
        return image

    def Normalize(self, image, content):
        [split1, split2, split3] = np.dsplit(image, 3)
        for x in np.nditer(split1, op_flags=['readwrite']):
            k = math.floor(x/360)
            if k != 0:
                x[...] = x - k*360
        max_value = np.amax(split2)
        min_value = np.amin(split2)
        if min_value != max_value:
            split2 = (split2-min_value)/(max_value-min_value+0.00001)
        ones = np.ones([224,224,1], dtype='float32')*0.7
        max_value = np.amax(split3)
        min_value = np.amin(split3)
        if min_value != max_value:
            split3 = (split3-min_value)/(max_value-min_value+0.00001)

        pp = self.Preprocess(content)[0]
        [split11, split21, split31] = np.dsplit(pp, 3)
        return np.concatenate([split1, ones, split31], axis=-1) # value is different for original and generated

    def SaveImage(self, image, content):
        image = self.Normalize(image, content)
        image = cv2.cvtColor(image, cv2.COLOR_HSV2BGR_FULL)
        max_value = np.amax(image)
        min_value = np.amin(image)
        if min_value != max_value:
            image = 255*(image-min_value)/(max_value-min_value)
        return image

    def Preprocess(self, image):
        # preprocess images - standarize(0,1), (reduce mean - optional), convert to hsv
        image = cv2.normalize(image, None, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_32F)
        image = cv2.cvtColor(image, cv2.COLOR_RGB2HSV_FULL)
        image = np.reshape(image, [1, 224, 224, 3])
        return image

    def Generate(self, it, content, style, start):
        style_pp = self.Preprocess(style)
        content_pp = self.Preprocess(content)
        y = self.model.Predict(style_pp)
        z = self.model.Predict(content_pp)
        target = y[:6] + [z[6]]
        self.generated = self.Preprocess(start+self.GenerateNoise(50, -25))
        (grad_step, loss, self.m1, self.m2) = self.model.Generate(self.generated, target, self.t, self.m1, self.m2)
        best_result = self.generated
        min_loss = loss
        self.ResetParameters()
        for i in range(0, it):
            (self.generated, loss, self.m1, self.m2) = self.model.Generate(self.generated, target, self.t, self.m1, self.m2)
            self.t = self.t + 1
            if loss <= min_loss:
                best_result = self.generated
                min_loss = loss
        return self.SaveImage(best_result[0], content)

    def Run(self, it, gray_image, color_image, start_image):
        content = self.LoadImageGray(gray_image)
        style = self.LoadImageColor(color_image, False)
        start = self.LoadImageColor(start_image, False)
        output_image = self.Generate(it, content, style, start)
        return output_image
