import tensorflow as tf
import numpy as np
import PIL

def load_graph(frozen_graph_filename):
    with tf.gfile.GFile(frozen_graph_filename, "rb") as f:
        graph_def = tf.GraphDef()
        graph_def.ParseFromString(f.read())

    with tf.Graph().as_default() as graph:
        tf.import_graph_def(graph_def, name="colorize")
    return graph

def postprocess(img):
    return (img[0]*255).astype('uint8')

def preprocess(gray, color):
    downscale = 16
    (width, height) = gray.size
    if width%downscale != 0:
        width = width-width%downscale
    if height%downscale != 0:
        height = height-height%downscale
    gray = gray.resize((width, height))
    color = color.resize((width, height), resample=PIL.Image.BILINEAR)
    color = np.asarray(color)
    gray = np.asarray(gray)
    if len(gray.shape) == 3:
        a, b, c = gray.shape
        if c > 1:
            gray = np.reshape(gray[:,:,0], [1,a,b,1])
        gray = np.reshape(gray, [1,a,b,1])
    else:
        raise ValueError('image shape is invalid')
    if len(color.shape) == 3:
        a, b, c = color.shape
        if c > 3:
            color = color[:,:,:3]
        color = np.reshape(color, [1,a,b,3])
    else:
        raise ValueError('image shape is invalid')
    return gray, color

def predict(gray, color, sess, tensors):
    gray, color = preprocess(gray, color)
    output = sess.run(tensors.y, feed_dict={tensors.gray: gray, tensors.color: color})
    return postprocess(output)

def load():
    graph = load_graph('frozen_model.pb')
    tensors = lambda: None
    tensors.gray = graph.get_tensor_by_name('colorize/input_gray:0')
    tensors.color = graph.get_tensor_by_name('colorize/input_rgb:0')
    tensors.y = graph.get_tensor_by_name('colorize/gen_output:0')
    sess = tf.Session(graph=graph)
    return sess, tensors
