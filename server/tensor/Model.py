import tensorflow as tf
import numpy as np
import VGGModel as vgg
import math

class Model:
    def __init__(self):
        tf.reset_default_graph()
        self.sess = None

    def NetworkModel(self):
        self.image = tf.get_default_graph().get_tensor_by_name( 'Placeholder:0' ) # [None, 224, 224, 3]
        self.conv1_1 = tf.get_default_graph().get_tensor_by_name( 'conv1_1:0' )
        self.conv1_2 = tf.get_default_graph().get_tensor_by_name( 'conv1_2:0' )
        self.conv2_1 = tf.get_default_graph().get_tensor_by_name( 'conv2_1:0' )
        self.conv2_2 = tf.get_default_graph().get_tensor_by_name( 'conv2_2:0' )
        self.conv3_1 = tf.get_default_graph().get_tensor_by_name( 'conv3_1:0' )
        self.conv3_2 = tf.get_default_graph().get_tensor_by_name( 'conv3_2:0' )
        self.conv3_3 = tf.get_default_graph().get_tensor_by_name( 'conv3_3:0' )
        self.conv4_1 = tf.get_default_graph().get_tensor_by_name( 'conv4_1:0' )
        self.conv4_2 = tf.get_default_graph().get_tensor_by_name( 'conv4_2:0' )
        self.conv4_3 = tf.get_default_graph().get_tensor_by_name( 'conv4_3:0' )
        self.conv5_1 = tf.get_default_graph().get_tensor_by_name( 'conv5_1:0' )
        self.conv5_2 = tf.get_default_graph().get_tensor_by_name( 'conv5_2:0' )
        self.conv5_3 = tf.get_default_graph().get_tensor_by_name( 'conv5_3:0' )
        self.h_val = tf.get_default_graph().get_tensor_by_name( 'preprocess/hsv_split:0' )
        self.s_val = tf.get_default_graph().get_tensor_by_name( 'preprocess/hsv_split:1' )
        self.v_val = tf.get_default_graph().get_tensor_by_name( 'preprocess/hsv_split:2' )

    def GramMatrix(self, tensor, shape):
        t1 = tf.reshape(tensor, shape)
        return tf.matmul( t1, t1, transpose_a = True )

    def Grayscale(self, image):
        return tf.image.rgb_to_grayscale(image)

    def ColorCorrelation(self, conv_gray, color, factor):
        angle = (color/180) * math.pi
        x = tf.cos(angle)
        y = tf.sin(angle)
        pool = tf.concat([x,y], axis=-1)
        if factor > 0:
            pool = tf.nn.avg_pool(pool,
                                   ksize=[1, factor, factor, 1],
                                   strides=[1, factor, factor, 1],
                                   padding='SAME')
        shape = [conv_gray.get_shape()[0]*conv_gray.get_shape()[1], conv_gray.get_shape()[2]]
        conv_gray = tf.reshape(conv_gray, shape)
        color_pool = tf.reshape(pool, [shape[0], 2])
        correlation = tf.matmul(conv_gray, color_pool, transpose_a = True)
        output = tf.nn.l2_normalize(correlation, axis=-1)
        return output

    def MSELoss(self, tensorA, tensorB):
        return tf.nn.l2_loss(tf.subtract(tensorA, tensorB))

    def Generator(self):
        self.NetworkModel()
        # Gradient descent generator
        self.targets = []
        self.losses = []
        self.color_corr = []
        self.color_corr.append(self.ColorCorrelation(self.conv1_1[0], self.h_val, 0))
        self.color_corr.append(self.ColorCorrelation(self.conv2_1[0], self.h_val, 2))
        self.color_corr.append(self.ColorCorrelation(self.conv3_1[0], self.h_val, 4))
        self.color_corr.append(self.ColorCorrelation(self.conv4_2[0], self.h_val, 8))
        self.color_corr.append(self.ColorCorrelation(self.conv5_3[0], self.h_val, 16))
        for i in range(len(self.color_corr)):
            self.targets.append(tf.placeholder('float', self.color_corr[i].get_shape(), name='target'))
            self.losses.append(self.MSELoss(self.targets[i], self.color_corr[i]))

        self.targets.append(tf.placeholder('float', shape=[None, 224, 224, 1], name='target'))
        self.targets.append(tf.placeholder('float', shape=[None, 224, 224, 1], name='target'))
        self.losses.append(self.MSELoss(self.s_val, self.targets[-2]))
        self.losses.append(self.MSELoss(self.v_val, self.targets[-1]))
        self.losses = tf.stack(self.losses)
        alpha = tf.constant(0.01) # 0.001
        beta1 = tf.constant(0.9) # 0.9
        beta2 = tf.constant(0.999) # 0.999
        epsilon = tf.constant(0.00000001) # 0.00000001
        weights = np.array([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0], dtype='float32')
        loss = tf.tensordot(weights, tf.reshape(self.losses, [len(self.targets)]), 1, name='generator_loss')
        gradient = tf.gradients(loss, self.h_val, name='generator_gradient')
        t = tf.placeholder('float', name='time_step')
        m = tf.placeholder('float', name='first_moment')
        v = tf.placeholder('float', name='second_moment')
        mp = tf.add(m*beta1, (1-beta1)*gradient, name='updated_first_moment')
        vp = tf.add(v*beta2, (1-beta2)*tf.multiply(gradient,gradient), name='updated_second_moment')
        md = tf.divide(mp, 1-tf.pow(beta1, t))
        vd = tf.divide(vp, 1-tf.pow(beta2, t))
        h_channel = tf.subtract(self.h_val, alpha*md/(tf.sqrt(vd)+epsilon))
        tf.concat([h_channel[0], self.s_val, self.v_val], axis=-1, name='generated_image')

    def Load(self):
        tf.reset_default_graph()
        network = vgg.VGGModel()
        network.VGGModel()
        saver = tf.train.Saver()
        self.Generator()
        self.sess = tf.Session()
        saver.restore(self.sess, tf.train.latest_checkpoint('/usr/src/app/server/tensor/Model/'))
        tf.get_default_graph().finalize()

    def Predict(self, image):
        target_output = self.sess.run(self.color_corr+[self.s_val, self.v_val], feed_dict={self.image:image})
        return target_output

    def Generate(self, image, target, t, first_moment, second_moment):
        feed_dict = {self.image:image, 'time_step:0':t,
                     'first_moment:0':first_moment, 'second_moment:0':second_moment}
        for i in range(len(self.targets)):
            feed_dict[self.targets[i]] = target[i]
        (generated, loss, updated_m1, updated_m2) = self.sess.run(
                ['generated_image:0', 'generator_loss:0',
                 'updated_first_moment:0', 'updated_second_moment:0'],
                feed_dict=feed_dict)
        return (generated, loss, updated_m1, updated_m2)

    def Close(self):
        if( not self.sess._closed ):
            self.sess.close()
