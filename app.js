// const url = 'https://coronavirus-19-api.herokuapp.com/all';
const url = 'https://disease.sh/v2/all';


const url2 = 'https://disease.sh/v2/countries?sort=cases';
// const url2 = 'https://coronavirus-19-api.herokuapp.com/countries';
//const url2 = 'https://corona.lmao.ninja/v2/countries?yesterday=true&sort=cases';
// const url3 = 'https://coronavirus-19-api.herokuapp.com/countries/Georgia';
const url3 = 'https://disease.sh/v2/countries/Georgia';



const sendRequestGlobal = (method, url) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(method, url);
        xhr.responseType = 'json';

        xhr.onload = () => {
                response = xhr.response;
            if (xhr.status >= 400) {
                reject(response);
            } else {
                resolve(response);
            };
        };

        xhr.onerror = () => {
            reject(response);
        };

        xhr.send();
    });
};

jQuery(document).ready(function() {
    jQuery('input').keypress(function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if ( (code==13) || (code==10) || (code==84))
            {
            jQuery(this).blur();
            return false;
            }
    });

    document.onkeydown = function(e) {
        if(event.keyCode == 123) {
           return false;
        }
        if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
           return false;
        }
        if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
           return false;
        }
        if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
           return false;
        }
        if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
           return false;
        }
      }

      document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
      });
});