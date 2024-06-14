function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
              openDropdown.classList.remove('show');
          }
      }
  }
}

function updateTotal() {
  var pricePerItem = 12000; // Giá mỗi sản phẩm
  var quantity = document.getElementById("quantity").value;
  var totalPrice = pricePerItem * quantity;
  document.getElementById("total-price").innerText = totalPrice.toLocaleString('vi-VN') + ' VND';
}

async function handlePayment() {
  const totalPriceText = document.getElementById('total-price').innerText;
  const amount = parseInt(totalPriceText.replace(/\D/g, ''));

  try {
      const response = await fetch('https://4jjl5xvc-5000.asse.devtunnels.ms/payment', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data && data.order_url) {
          window.location.href = data.order_url;
      } else {
          console.error('Payment error:', data);
      }
  } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment error: ${error.message}`);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const quantityInput = document.getElementById('quantity');
  const payWithZaloPayButton = document.getElementById('zalopay-button');

  if (quantityInput) {
      quantityInput.addEventListener('input', updateTotal);
  }

  if (payWithZaloPayButton) {
      payWithZaloPayButton.addEventListener('click', handlePayment);
  }
});