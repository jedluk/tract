import matplotlib.pyplot as plt
import numpy as np
import cv2
import datetime
import Model

class Generator:
    def __init__(self):
        self.model = Model.Model()
        self.model.Load()
        self.ResetParameters()

    def Close(self):
        self.model.Close()

    def ResetParameters(self):
        self.t = 1
        self.m1 = 0
        self.m2 = 0

    def GenerateNoise(self, a, b):
        return np.random.random_sample((1, 224, 224, 3))*a+b
    
    def LoadImageColor(self, path):
        image = cv2.imread(path, cv2.IMREAD_COLOR)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image = cv2.resize(image, (224,224))
        return image
    
    def LoadImageGray(self, path):
        image = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
        image = cv2.resize(image, (224,224))
        image = np.tile(np.expand_dims(image, 2), [1,1,3])
        return image

    def SaveImage(self, image, path):
        image = np.clip(image, 0, 255)
        image = image.astype('float32')
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        cv2.imwrite(path, image)

    def Normalize(self, gray, color):
        # Gray is target intensity, color is intensify to normalize
        s1 = np.sum(gray, axis=-1)
        s2 = np.sum(color, axis=-1)
        # TODO: check division by 0
        d = np.divide(s1, s2)
        d = np.tile(np.expand_dims(d, 2), [1,1,3])
        return np.multiply(color, d)

    def Generate(self, it, generated, image):
        y = self.model.Predict(image)
        z = self.model.Predict(generated)
        y[1] = z[1]
        (grad_step, loss, self.m1, self.m2) = self.model.Generate(generated, y, self.t, self.m1, self.m2)
        best_result = generated
        min_loss = loss
        graph = [0]
        graph.append(loss)
        self.ResetParameters()
        for i in range(it):
            (generated, loss, self.m1, self.m2) = self.model.Generate(generated, y, self.t, self.m1, self.m2)
            self.t = self.t + 1
            if loss < min_loss:
                best_result = generated
                min_loss = loss
            graph.append(loss)
            #if i%500 == 0:
            print("Iteration: ", i, " Current time: ", datetime.datetime.now())
        return (best_result[0], graph)

    def ShowPlot(self, data):
        x = np.arange(len(data))
        y = np.array(data)
        p = plt.plot(x, y)
        plt.xlim(x.min(), x.max())
        plt.ylim(y.min(), y.max())
        plt.show()

    def Run(self, it, gray_name, color_name, output_name):
        image = self.LoadImageColor(color_name)
        image = np.reshape(image, [1, 224, 224, 3])
        #generated = self.GenerateNoise(255, 0)
        generated = self.LoadImageGray(gray_name)
        generated = np.reshape(generated, [1, 224, 224, 3])
        output = self.Generate(it, generated, image)
        output_image = self.Normalize(generated[0], output[0])
        self.ShowPlot(output[1])
        self.SaveImage(output_image, output_name)

if __name__ == '__main__':
    generator = Generator()
    generator.Run(5000, 'dog_gray.png', 'lizard.png', 'test.png')
    generator.Close()