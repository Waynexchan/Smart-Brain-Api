// 在文件頂部，移除 node-fetch 的同步導入

const handleClarifaiCall = async (req, res) => {
    const fetch = await import('node-fetch');  // 動態導入 node-fetch
    const PAT = '17fb6892b58947a38e9526e16e3fb987'; 
    const USER_ID = 'clarifai'; 
    const APP_ID = 'main'; 
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
    const IMAGE_URL = req.body.input;

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    try {
        const response = await fetch.default(`https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`, requestOptions);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(400).json('unable to work with API');
    }
};

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'));
};

module.exports = {
    handleImage,
    handleClarifaiCall
};
