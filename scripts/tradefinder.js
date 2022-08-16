let Data = [];

let Ads_List = document.getElementById("items");

let Information = JSON.parse(localStorage["AccountInformation"]);

const loadData = async () => {

    try {

        await fetch('/data.json')
        .then(result => result.json())
        .then((output) => {
    
            console.log(output);

            Data = output;
    
            localStorage["DataBackup"] = JSON.stringify(output);
    
        })

    } catch (error) {

        console.log(error);
    
        if (Array.isArray(JSON.parse(localStorage["DataBackup"]))) {
    
            Data = JSON.parse(localStorage["DataBackup"]);

        }

    }

};

const renderAd = (Info) => {

    fetch("/sections/tradead.html")
    .then((response) => response.text())
    .then((html) => {

        Ads_List.innerHTML = html + Ads_List.innerHTML;

        document.getElementById('image-trade-ad-notset').style.backgroundImage = 'url(' + Info.Picture + ')';
        
        document.getElementById('image-trade-ad-notset').id = "image-trade-ad";

        let Element = document.getElementById('box-trade-ad-offer-notset');
        let Button = document.getElementById('box-trade-ad-button-notset');

        let ButtonID = "box-trade-ad-button" + (new Date()).getTime() + Math.floor(Math.random() * 100);

        Element.id= "box-trade-ad-offer" + (new Date()).getTime() + Math.floor(Math.random() * 100);
        Button.id = ButtonID;

        for (let item of Info.Trade) {

            for (let Table of Data){

                if (String(Table.Header1) == String(item)) {

                    let html = document.createElement("div");

                    html.innerHTML = `
        
                    <div class="box-trade-ad-item">
                        <img src="${Table.Image1}" style="width: 100%; margin-top: 1.3rem;" alt="Item_Image">
                    </div>
        
                    `;
                    
                    Element.appendChild(html);

                };

            };

        };   

        var myInterval = setInterval(function() {
            
            document.getElementById(ButtonID).onclick = function() {

                document.getElementById('popup').style.display = 'block';
    
                document.getElementById('popup-contact-method').innerText = ("Contact Method: " + Info.ContactMethod)
    
                if (Info.ContactMethod == "Email") {
    
                    document.getElementById('popup-username').innerText = ("Email: " + Info.Email);
    
                };
    
                if (Info.ContactMethod == "Discord") {
    
                    document.getElementById('popup-username').innerText = ("Discord: " + Info.Discord);
    
                };
    
            }
                
        }, 2000);
    
    })

};

loadData();

if (Information === null || Information === undefined) {

    console.log("ERROR | No login data found.");

} else {

    fetch("/sections/create-ad.html")
    .then((response) => response.text())
    .then((html) => {

        document.getElementById("box-create-ad-7p979z8r").innerHTML = html;

        document.getElementById("pfp-create-ad").style.backgroundImage = 'url(' + Information.picture + ')';

        let form  = document.getElementById('create-ad-form');

        let error_text  = document.getElementById('error-text');
        let success_text  = document.getElementById('success-text');

        form.addEventListener('submit', (event) => {

            event.preventDefault();

            let item = form.elements['trade-item'].value;
            let item2 = form.elements['trade-item2'].value;
            let item3 = form.elements['trade-item3'].value;
            let item4 = form.elements['trade-item4'].value;
            let discord = form.elements['discord-text'].value;
            let contact_method = form.elements['contact-method'].value;

            if (contact_method == 'Discord' && discord == "")  {

                error_text.innerText = "Error | Since your contact method is discord you must provide your username and tag."

                success_text.innerText = ""

                return;

            };

            try {

                Database.collection('TradeAds').add({
                    Trade: [item, item2, item3, item4],
                    Discord: discord,
                    Picture: Information.picture,
                    Email: Information.email,
                    ContactMethod: contact_method,
                    Time: (new Date()).getTime()
                });
    
                error_text.innerText = ""
    
                success_text.innerText = "Success | Your ad has been posted."

            }
            catch (error) {

                error_text.innerText = "Error | Failed to create ad. Please try again later."

                success_text.innerText = ""

            }

        });

    })

};

setTimeout(function() {
            
    Database.collection('TradeAds').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if(change.type === 'added') {
    
            renderAd(change.doc.data());
    
          }
        })
    })

}, 1000);