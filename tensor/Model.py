import tensorflow as tf
import numpy as np
import VGGModel as vgg

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
        #self.convs = [self.conv1_1, self.conv1_2,
        #              self.conv2_1, self.conv2_2,
        #              self.conv3_1, self.conv3_2, self.conv3_3,
        #              self.conv4_1, self.conv4_2, self.conv4_3,
        #              self.conv5_1, self.conv5_2, self.conv5_3]
        self.convs = [self.conv1_1]

    def GramMatrix(self, tensor, shape):
        t1 = tf.reshape(tensor, shape)
        return tf.matmul( t1, t1, True )

    def MSELoss(self, tensorA, tensorB, factor):
        return tf.multiply(factor, tf.reduce_sum(tf.square(tf.subtract(tensorA, tensorB))))

    def Generator(self):
        self.NetworkModel()
        # Gradient descent generator
        self.optimize_len = len(self.convs)
        self.targets = []
        self.grams = []
        for item in self.convs:
            self.targets.append(tf.placeholder('float', item.get_shape(), name="target"))
            self.grams.append(self.GramMatrix(item, [item.get_shape()[1]*item.get_shape()[2], item.get_shape()[3]]))
        for item in self.grams:
            self.targets.append(tf.placeholder('float', item.get_shape(), name="target"))
        self.losses = []
        for i in range(self.optimize_len):
            self.losses.append(self.MSELoss(self.targets[i], self.convs[i], 0.5))
        for i in range(self.optimize_len):
            shape = [self.targets[i].get_shape()[1]*self.targets[i].get_shape()[2], self.targets[i].get_shape()[3]]
            factor = int(shape[0]*shape[0])
            self.losses.append(self.MSELoss(self.targets[self.optimize_len + i], self.grams[i], 1/(factor * 4)))
        self.losses = tf.stack(self.losses)
        self.weights = tf.placeholder('float', [2*self.optimize_len], name="weights")
        alpha = tf.constant(0.005) # 0.001
        beta1 = tf.constant(0.96) # 0.9
        beta2 = tf.constant(0.9996) # 0.99
        epsilon = tf.constant(0.00000001) # 0.00000001
        loss = tf.tensordot(self.weights, tf.reshape(self.losses, [2*self.optimize_len]), 1, name="generator_loss")
        gradient = tf.gradients(loss, self.image, name="generator_gradient")
        t = tf.placeholder('float', name='time_step')
        m = tf.placeholder('float', name='first_moment')
        v = tf.placeholder('float', name='second_moment')
        mp = tf.add(m*beta1, (1-beta1)*gradient, name='updated_first_moment')
        vp = tf.add(v*beta2, (1-beta2)*tf.multiply(gradient,gradient), name='updated_second_moment')
        md = tf.divide(mp, 1-tf.pow(beta1, t))
        vd = tf.divide(vp, 1-tf.pow(beta2, t))
        tf.subtract(self.image, alpha*md/(tf.sqrt(vd)+epsilon), name="generated_image")

    def Load(self):
        tf.reset_default_graph()
        network = vgg.VGGModel()
        network.VGGModel()
        saver = tf.train.Saver()
        self.Generator()
        self.sess = tf.Session()
        saver.restore(self.sess, tf.train.latest_checkpoint('./Model/'))

    def Predict(self, image):
        target_output = self.sess.run(self.convs + self.grams, feed_dict={self.image:image})
        return target_output

    def Generate(self, image, target, t, first_moment, second_moment):
        weights = np.array([1.0, 1.0])
        feed_dict = {self.image:image, 'time_step:0':t,
                     'first_moment:0':first_moment, 'second_moment:0':second_moment,
                           'weights:0':weights}
        for i in range(2*self.optimize_len):
            feed_dict[self.targets[i]] = target[i]
        (generated, loss, updated_m1, updated_m2) = self.sess.run(
                ['generated_image:0', 'generator_loss:0',
                 'updated_first_moment:0', 'updated_second_moment:0'],
                feed_dict=feed_dict)
        return (generated[0], loss, updated_m1, updated_m2)

    def Close(self):
        if( not self.sess._closed ):
            self.sess.close()
