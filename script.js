calculatePrice()
getBookingDates()

function getValueOfDate() {
    document.getElementById('popup-book-date').textContent = document.getElementById('book-date').value;
}
function copyCardNumber() {
    const cardNumber = document.getElementById('card-number').textContent;

    navigator.clipboard.writeText(cardNumber)
}
var phoneInput = document.querySelector('.phone')
phoneInput.addEventListener('keydown', function(event) {
   if( !(event.key == 'ArrowLeft' ||  event.key == 'ArrowRight' ||  event.key == 'Backspace' || event.key == 'Tab')) { event.preventDefault() }
    var mask = '+380 (11) 111-11-11'; 
 
    if (/[0-9+\ -()]/.test(event.key)) {    
        var currentString = this.value;
        var currentLength = currentString.length;
        if (/[0-9]/.test(event.key)) {
            if (mask[currentLength] == '1') {
                this.value = currentString + event.key;
            } else {
                for (var i=currentLength; i<mask.length; i++) {
                if (mask[i] == '1') {
                    this.value = currentString + event.key;
                    break;
                }
                currentString += mask[i];
                }
            }
        }
    } 
});

function getBookingDates(){
    fetch('https://loungespace.site/api/getBookings')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const disabledDates = data.data.map(booking => booking.date_from);
                flatpickr("#book-date", {
                    locale: {
                        firstDayOfWeek: 1,
                        weekdays: {
                            shorthand: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                            longhand: ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П’ятниця', 'Субота'],
                        },
                        months: {
                            shorthand: ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'],
                            longhand: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
                        },
                    },
                    minDate: "today",
                    dateFormat: "Y-m-d",
                    disable: disabledDates.map(date => ({
                        from: date,
                        to: date,
                    }))
                });
            } else {
                console.error('Ошибка получения данных');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
}

function calculatePrice() {
    let price = 3500;
    let isHoliday = checkIsHoliday()
    let withAnimals = checkAnimals()

    price = isHoliday ? price+500 : price
    price = withAnimals ? price+300 : price

    let el_price = document.getElementById("price")
    el_price.innerHTML = (price+" грн.");
}

const checkbox = document.getElementById('accept_terms');
const button = document.getElementById('submitBtn');

    checkbox.addEventListener('change', function() {
        if (this.checked) {
            button.classList.remove('disabled');
            button.classList.add('active');
        } else {
            button.classList.add('disabled');
            button.classList.remove('active');
        }
});

let popupBg = document.querySelector('.popup_bg');
let popup = document.querySelector('.popup');
let openPopupButtons = document.querySelectorAll('.open-popup');
let closePopupButton = document.querySelector('.close-popup');

function popup_activate (){
    getValueOfDate();
    popupBg.classList.add('active');
    popup.classList.add('active');
}
function popup_deactivate (){
    popupBg.classList.remove('active');
    popup.classList.remove('active');
    location.reload();
}
function validateForm() {
    let firstName = document.getElementById("first-name").value;
    let surname = document.getElementById("surname").value;
    let phone = document.getElementById("phone").value;
    let dates = document.getElementById("book-date").value;
    let animals = document.getElementById("animals").value && document.getElementById("animals").value === 2
    let comment = document.getElementById("client-comment").value
    let price = document.getElementById("price").textContent.replace(/\D/gi, '')
    if (firstName === "" || surname === "" || phone === "" || dates === "") {
      console.log("Пожалуйста, заполните все поля формы.");
      return false;
    } else {
        let data = {
            firstName: firstName,
            surname: surname,
            phone: phone,
            dates: dates,
            animals: animals,
            comment: comment,
            price: price,
        };

        fetch('https://loungespace.site/api/booking', {
            method: 'POST',
            body: JSON.stringify(data)
        })
            .then(response => {
                return response.json(); // Обработка ответа как JSON
            })
            .then(data => {
                if (data.success) {
                    popup_activate();
                } else {
                    alert(`Сталась помилка: ${data.error_msg}`);
                }
            })
            .catch(error => {
                alert('Сталась помилка під час виконання запиту. Будь-ласка, перевірте правильність заповненних даних та спробуйте ще раз');
            });
      return true;
    }
}

function checkIsHoliday() {
    let date = document.getElementById("book-date").value.toString()
    let bookDate = date && date !== '' ? date : Date.now()
    let currentDate = new Date(bookDate);
    let currentDay = currentDate.getDay(); // Возвращает день недели (0 - воскресенье, 1 - понедельник, ..., 6 - суббота)

    let isHoliday
    if (currentDay >= 1 && currentDay <= 4) { // Понедельник - четверг
        isHoliday = false
    } else { // Пятница - воскресенье
        isHoliday = true
    }

    return isHoliday;
}

function checkAnimals(){
    let selectElement = document.getElementById("animals");
    let selectedValue = selectElement.value;

    let withAnimals
    if (selectedValue === "1" ) {
        withAnimals = false
    } else {
        withAnimals = true
    }

    return withAnimals
}

document.getElementById('book-date').addEventListener('change', function() {
    calculatePrice()
});

document.getElementById('animals').addEventListener('change', function() {
    calculatePrice()
});

document.addEventListener("DOMContentLoaded", function() {
    const peopleCount = document.getElementById("peopleCount");
    const addPersonBtn = document.getElementById("addPerson");
    const removePersonBtn = document.getElementById("removePerson");
  
    let count = 4; 
    // updateCount();
    //
    // function updateCount() {
    //   peopleCount.textContent = count;
    // }

    // addPersonBtn.addEventListener("click", function() {
    //   if (count < 6) {
    //     count++;
        //updateCount();
    //  }
    //});
  
    // removePersonBtn.addEventListener("click", function() {
    //   if (count > 1) {
    //     count--;
        //updateCount();
    //   }
    // });
  });


function clearFormData () {

}