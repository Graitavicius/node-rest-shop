const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

//detailed way of storing files
//cb - callback
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    //reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
       cb(null, true); 
    } else {
        cb(null, false);
    }
    
    
}

// max file size = 5mb
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    }, 
    fileFilter: fileFilter
});


router.get('/', ProductsController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

router.get("/:productId", ProductsController.products_get_product);

router.patch("/:productId", checkAuth, ProductsController.products_update_product);

router.delete('/:productId', checkAuth, ProductsController.product_delete_product);

module.exports = router;