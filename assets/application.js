    if (document.getElementById("sort_by") != null) {
        document.querySelector("#sort_by").addEventListener("change", function (e) {
            var url = new URL(window.location.href);
            url.searchParams.set("sort_by", e.currentTarget.value);

            window.location = url.href;
        });
    }

    if (document.getElementById('countryAddresses') != null) {
        document.getElementById('countryAddresses').addEventListener('change', function (e) {
            var provinces = this.options[this.selectedIndex].getAttribute('data-provinces');
            var provinceSelector = document.getElementById('provinceAddresses');
            var provinceArray = JSON.parse(provinces)

            if (provinceArray.length < 1) {
            provinceSelector.setAttribute('disabled', 'disabled')
            }
            else{
                provinceSelector.removeAttribute('disabled')
            }



            provinceSelector.innerHTML = '';
            
            var options = ''

            for (let index = 0; index < provinceArray.length; index++) {
                options += '<option value="' + provinceArray[index][0] + '">' + provinceArray[index][0] + '</option>'
            }

            provinceSelector.innerHTML = options
        
        })
    }

    if (document.getElementById('forgotPassword') != null) {
        document.getElementById("forgotPassword").addEventListener("click", function (e) {
            const element = document.querySelector('#forgot-password-form')
            if(element.classList.contains('hidden')){
                element.classList.remove('hidden');
                element.classList.add('block')
            }
        });      
    }

const modal = document.querySelector('.main-modal');
const closeButton = document.querySelectorAll('.modal-close');

const modalClose = () => {
    modal.classList.remove('fadeIn');
    modal.classList.add('fadeOut');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 500);
}

const openModal = () => {
    modal.classList.remove('fadeOut');
    modal.classList.add('fadeIn');
    modal.style.display = 'flex';
}

for (let i = 0; i < closeButton.length; i++) {

    const elements = closeButton[i];

    elements.onclick = (e) => modalClose();

    modal.style.display = 'none';

    window.onclick = function (event) {
        if (event.target == modal) modalClose();
    }
}

var productInfoAnchors = document.querySelectorAll('#productInfoAnchor')
if (productInfoAnchors.length > 0) {
    productInfoAnchors.forEach(item => {
        item.addEventListener('click', event => {
            var url = `/products/${item.getAttribute('product-handle')}.js`
            fetch(url)
            .then((res) => res.json())
            .then(function(data){
            document.getElementById("productImg").src = data.images[0]
            document.getElementById("productTags").innerHTML = data.tags[0]
            document.getElementById("productTitle").innerHTML = data.title
            document.getElementById("productDescription").innerHTML = data.description
            document.getElementById("productPrice").innerHTML = item.getAttribute('product-price')
            // document.getElementById('modalItemId').value = data.variants[0].id

            var variants = data.variants;
            var variantSelect = document.getElementById('modalSelectID')

            variantSelect.innerHTML = ""

            variants.forEach(function(variant, index){
                variantSelect.options[variantSelect.options.length] = new Option(variant.option1, variant.id)
            })


            })


        })
    })
    
}

var modalAddToCartForm = document.querySelector('#addToCartForm')

if( modalAddToCartForm != null ) {
    
    modalAddToCartForm.addEventListener('submit', function (event) {
        event.preventDefault();

        let formData = {
            'items':[
                {
                    'id':document.getElementById('modalSelectID').value,
                    'quantity':document.getElementById('modalItemQuantity').value
                }
            ]
        }

        fetch(`/cart/add.js`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
            
        })
        .then((res) => {
            return res.json()
        })
        .then((data) => update_cart())
        .catch((err) => {
            console.error(err)
        })
    })
}

document.addEventListener('DOMContentLoaded', function() {
    update_cart();
});

function update_cart() {
    fetch(`/cart.js`)
    .then((res) => res.json())
    .then((data) => {
        document.getElementById('numberOfCartItems').innerHTML = data.items.length
    
    })
    .catch((err) => {
        console.error(err)
    })
}

var predictiveSearch = document.getElementById('searchInput');
var searchResults = document.getElementById('searchResults')
var timer

predictiveSearch.addEventListener('input', function(event) {
    console.log(predictiveSearch.value);

    clearTimeout(timer)

    if (predictiveSearch.value) {
        timer = setTimeout(fetchPredictiveSearch, 3000)
    }


})

function fetchPredictiveSearch() {
    fetch(`/search/suggest.json?q=${predictiveSearch.value}&resources[type]=product`)
    .then((res) => res.json())
    .then((data) => {
        console.log(data)
        var products = data.resources.results.products
        searchResults.innerHTML = ''

        products.forEach(function(product, index){
            searchResults.innerHTML += 
            `           
             <li class="pl-8 pr-2 py-1 border-b-2 border-gray-100 relative cursor-pointer hover:bg-yellow-50 hover:text-gray-900">
                <svg class="absolute w-4 h-4 left-2 top-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
                <p><a href = "${product.url}">${product.title}</a></p>
            </li>

            `
        })
    })


}