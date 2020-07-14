const tf = require("@tensorflow/tfjs");

module.exports = {
    getTensor: async (req, res, next) => {
        const model = tf.sequential();

        const hiddenLayer = tf.layers.dense({
            units: 4,
            inputShape: [2],
            activation: 'sigmoid',
        });
        model.add(hiddenLayer);

        const outputLayer = tf.layers.dense({
            units: 3,
            activation: 'sigmoid',
        });
        model.add(outputLayer);

        model.compile({
            optimizer: tf.train.sgd(0.1),
            loss: tf.losses.meanSquaredError
        });

        const xs = tf.tensor2d([
            [0.25, 0.92],
            [0.12, 0.3],
            [0.4, 0.74]
        ]);

        const ys = tf.tensor2d([
            [3, 4, 5],
            [1, 2, 7],
            [8, 6, 9]
        ]);

        const history = await model.fit(xs, ys, {
            verbose: true,
            epochs: 100,
            shuffle: true
        }).then((response) => {
            console.log(response.history.loss);
            console.log('Training complete');
            const output = model.predict(xs);
            output.print();
        });

        const arr = new Array(3);
        arr[0] = "Khanh";
        arr[1] = "Như";
        const body = {
            deleteDataID: arr
        };


        res.status(200).json({
            data: body
        })
    }
};
