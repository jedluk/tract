import cv2
import sys
import numpy as np
import math
import random

DEV_MODE = 1
B_CHANNEL, G_CHANNEL, R_CHANNEL = (0,1,2)

def getArgs():
    img, N, SAMPLES = (None, 5, 1000)
    if len(sys.argv) == 4:
        img = sys.argv[1] 
        N = sys.argv[2]
        SAMPLES = sys.argv[3]
    return img, N, SAMPLES

img, N, SAMPLES = getArgs()

img_color = cv2.imread(img if img else 'black_hotel.jpg')
img_gray = cv2.cvtColor(img_color, cv2.COLOR_BGR2GRAY)
heigth, width, channels = img_color.shape
if DEV_MODE:
    print(heigth, width, channels)

blur = cv2.blur(img_color, (5, 5))
cumHist = np.zeros([heigth, width])

for x in range(0, heigth):
    for y in range(0, width):
        cumHist[[x], [y]] = (int(blur[x, y, B_CHANNEL]) +
                             int(blur[x, y, G_CHANNEL]) + int(blur[x, y, R_CHANNEL]))

cumHistVec = cumHist.flatten()
cumHistVecSort = np.sort(cumHistVec)

thresholds = np.zeros((1, N))
spread = int(len(cumHistVec) / N)

for i in range(0, N):
    lowerBand = i * spread
    upperBand = (i+1) * spread
    thresholds[(0, i)] = np.median(cumHistVecSort[lowerBand:upperBand])

if DEV_MODE:
    print(thresholds)

pixelClusters = np.zeros((SAMPLES, 4))
print(pixelClusters)

for sample in range(0, SAMPLES):
    b = blur[random.randint(0, heigth - 1),
             random.randint(0, width - 1), B_CHANNEL]
    g = blur[random.randint(0, heigth - 1),
             random.randint(0, width - 1), G_CHANNEL]
    r = blur[random.randint(0, heigth - 1),
             random.randint(0, width - 1), R_CHANNEL]
    sum = int(b) + int(g) + int(r)
    differs = np.zeros((1, N))
    for clusterIdx in range(0, N):
        differs[(0, clusterIdx)] = abs(thresholds[(0, clusterIdx)] - sum)
    idx = np.argmin(differs)
    pixelClusters[(sample, 0)] = b
    pixelClusters[(sample, 1)] = g
    pixelClusters[(sample, 2)] = r
    pixelClusters[(sample, 3)] = idx

# sortedPixelClusters = pixelClusters[pixelClusters[:, 3].argsort()]
triples = np.zeros((N, 3))
for ind in range(0, N):
    triple = np.median(pixelClusters[pixelClusters[:, 3] == ind], axis=0)
    triples[(ind, 0)] = triple[0]
    triples[(ind, 1)] = triple[1]
    triples[(ind, 2)] = triple[2]


if DEV_MODE:
    print(triples)
    print(triples[0,0])
    print(triples[0,1])
    print(triples[0,2])

triples_mean = [int(np.mean(row)) for row in triples]
if DEV_MODE:
    print(triples_mean)

out = np.zeros([heigth, width, 3])

# count hist
grayHist = img_gray.flatten()
# cv2.calcHist()
grayHistSort = np.sort(grayHist)

arr = [1, 100, 88, 140, 222]
for a in arr:
    print(np.argmin([abs(a - mean) for mean in triples_mean]))

for x in range(0, heigth):
    for y in range(0, width):
        idx = np.argmin([abs(img_gray[x,y] - mean) for mean in triples_mean])
        out[[x],[y],0] = triples[idx,0]
        out[[x],[y],1] = triples[idx,1]
        out[[x],[y],2] = triples[idx,2]

cv2.imwrite('test.png',out)
