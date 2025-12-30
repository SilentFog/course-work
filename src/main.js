import './scss/style.scss';

import '../js/more-product';
import '../js/slider';
import '../js/products';
import '../js/product-page';
import '../js/price';
import '../js/Add-to-cart';
import '../js/crumbsCurrent';
import '../js/header-cart2';
import '../js/relatedProducts';
import '../js/disabled';
import '../js/crumbsCurrent'; 
import '../js/ordering';
import '../js/user';
import '../js/advertisement';
import '../js/frontend';
import '../js/form';
import '../js/restore-account';
import '../js/profile';


document.addEventListener('DOMContentLoaded', () => {
    if (typeof updateHeaderBasket === 'function') {
        updateHeaderBasket();
    }
});

    