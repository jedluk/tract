import cv2
import sys

image = cv2.imread(sys.argv[1])
gray_image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
cv2.imwrite("{0}".format(sys.argv[2]), gray_image)
print("ready")
