    let engToGeo = {
        'China' : 'ჩინეთი', 'Bosnia' : 'ბოსნია', 'Botswana' : 'ბოტსვანა', 'Burundi' : 'ბურუნდი', 'Yemen' : 'იემენი', 'Swaziland' : 'სვაზილენდი', 'Western Sahara' : 'დასავლეთ საჰარა', 'USA' : 'აშშ (ამერიკის შეერთებული შტატები)', 'Italy' : 'იტალია', 'Spain' : 'ესპანეთი', 'Germany' : 'გერმანია', 'Iran' : 'ირანი', 'France' : 'საფრანგეთი', 'Switzerland' : 'შვეიცარია', 'UK' : 'დიდი ბრიტანეთი (გაერთ. სამეფო)', 'Central African Republic' : 'ცენტრალური აფრიკის რესპუბლიკა', 'S. Korea' : 'სამხრეთ კორეა', 'Caribbean Netherlands' : 'ნიდერლანდები', 'Austria' : 'ავსტრია', 'Belgium' : 'ბელგია', 'Canada' : 'კანადა', 'Turkey' : 'თურქეთი', 'Portugal' : 'პორტუგალია', 'Norway' : 'ნორვეგია', 'Australia' : 'ავსტრალია', 'Brazil' : 'ბრაზილია', 'Sweden' : 'შვედეთი', 'Israel' : 'ისრაელი', 'Malaysia' : 'მალაიზია', 'Czechia' : 'ჩეხეთი', 'Denmark' : 'დანია', 'Ireland' : 'ირლანდია', 'Luxembourg' : 'ლუქსემბურგი', 'Ecuador' : 'ეკვადორი', 'Japan' : 'იაპონია', 'Chile' : 'ჩილე', 'Poland' : 'პოლონეთი', 'Pakistan' : 'პაკისტანი', 'Thailand' : 'ტაილანდი', 'Romania' : 'რუმინეთი', 'Saudi Arabia' : 'საუდის არაბეთი', 'Finland' : 'ფინეთი', 'South Africa' : 'სამხრეთ აფრიკა', 'Indonesia' : 'ინდონეზია', 'Greece' : 'საბერძნეთი', 'Russia' : 'რუსეთი', 'Iceland' : 'ისლანდია', 'India' : 'ინდოეთი', 'Diamond Princess' : 'ბრილიანტის პრინცესა(საკრუიზო გემი)', 'Philippines' : 'ფილიპინები', 'Singapore' : 'სინგაპური', 'Peru' : 'პერუ', 'Slovenia' : 'სლოვენია', 'Panama' : 'პანამა', 'Qatar' : 'ყატარი', 'Estonia' : 'ესტონეთი', 'Argentina' : 'არგენტინა', 'Egypt' : 'ეგვიპტე', 'Croatia' : 'ხორვატია', 'Colombia' : 'კოლუმბია', 'Dominican Republic' : 'დომინიკის რესპუბლიკა', 'Mexico' : 'მექსიკა', 'Bahrain' : 'ბაჰრეინი', 'Serbia' : 'სერბეთი', 'Hong Kong' : 'ჰონგ კონგი', 'Iraq' : 'ერაყი', 'Lebanon' : 'ლიბანი', 'Algeria' : 'ალჟირი', 'UAE' : 'არაბეთის გაერთიანებული საამიროები', 'Lithuania' : 'ლიტვა', 'Armenia' : 'სომხეთი', 'New Zealand' : 'Ახალი ზელანდია', 'Morocco' : 'ემაროკო', 'Bulgaria' : 'ბულგარეთი', 'Hungary' : 'უნგრეთი', 'Taiwan' : 'ტაივანი', 'Latvia' : 'ლატვია', 'Costa Rica' : 'კოსტა - რიკა', 'Slovakia' : 'სლოვაკეთი', 'Andorra' : 'ანდორა', 'Uruguay' : 'ურუგვაი', 'Jordan' : 'იორდანია', 'San Marino' : 'სან მარინო', 'Kuwait' : 'ქუვეითი', 'North Macedonia' : 'ჩრდილოეთ მაკედონია', 'Tunisia' : 'ტუნისი', 'Ukraine' : 'უკრაინა', 'Bosnia and Herzegovina' : 'ბოსნია და ჰერცოგოვინა', 'Moldova' : 'მოლდოვა', 'Albania' : 'ალბანეთი', 'Vietnam' : 'ვიეტნამი', 'Burkina Faso' : 'ბურკინა ფასო', 'Cyprus' : 'კვიპროსი', 'Faeroe Islands' : 'ფაეროას კუნძულები', 'Réunion' : 'რეიუნიონი', 'Malta' : 'მალტა', 'Ghana' : 'განა', 'Azerbaijan' : 'აზერბაიჯანი', 'Brunei' : 'ბრუნეი', 'Kazakhstan' : 'ყაზახეთი', 'Oman' : 'ომანი', 'Venezuela' : 'ვენესუელა', 'Falkland Islands (Malvinas)' : 'ფოლკლენდის კუნძულები (მალვინები)', 'Sri Lanka' : 'შრი ლანკა', 'Senegal' : 'სენეგალი', 'Cambodia' : 'კამბოჯა', "Côte d'Ivoire" : 'სპილოს ძვლის სანაპირო', 'Afghanistan' : 'ავღანეთი', 'Belarus' : 'ბელარუსი', 'Palestine' : 'პალესტინა', 'Mauritius' : 'მავრიკი', 'Georgia' : 'საქართველო', 'Cameroon' : 'კამერუნი', 'Uzbekistan' : 'უზბეკეთი', 'Guadeloupe' : 'გვადელუპა', 'Montenegro' : 'მონტენეგრო', 'Cuba' : 'კუბა', 'Channel Islands' : 'ნორმანდიის კუნძულები', 'Martinique' : 'მარტინიკა', 'Nigeria' : 'ნიგერია', 'Trinidad and Tobago' : 'ტრინიდადი და ტობაგო', 'Liechtenstein' : 'ლიხტენშტეინი', 'Honduras' : 'ჰონდურასი', 'DRC' : 'კონგოს დემოკრატიული რესპუბლიკა', 'Rwanda' : 'რუანდა', 'Bangladesh' : 'ბანგლადეში', 'Kyrgyzstan' : 'ყირგიზეთი', 'Bolivia' : 'ბოლივია', 'Paraguay' : 'პარაგვაი', 'Mayotte' : 'მაიოტი', 'Gibraltar' : 'გიბრალტარი', 'Monaco' : 'მონაკო', 'Kenya' : 'კენია', 'Macao' : 'მაკაო', 'French Polynesia' : 'საფ. პოლინეზია', 'Aruba' : 'არუბა', 'French Guiana' : 'საფ. გვიანა', 'Jamaica' : 'იამაიკა', 'Guatemala' : 'გვატემალა', 'Isle of Man' : 'მენის კუნძული', 'Madagascar' : 'მადაგასკარი', 'Togo' : 'ტოგო', 'Barbados' : 'ბარბადოსი', 'Zambia' : 'ზამბია', 'Bermuda' : 'ბერმუდა', 'New Caledonia' : 'ახალი კალედონია', 'Uganda' : 'უგანდა', 'El Salvador' : 'სალვადორი', 'Maldives' : 'მალდივები', 'Tanzania' : 'ტანზანია', 'Equatorial Guinea' : 'ეკვატორული გვინეა', 'Ethiopia' : 'ეთიოპია', 'Djibouti' : 'ჯიბუტი', 'Dominica' : 'დომინიკავ', 'Mongolia' : 'მონღოლეთი', 'Saint Martin' : 'წმინდა მარტინის კუნძული', 'Niger' : 'ნიგერი', 'Bahamas' : 'ბაჰამის კუნძულები', 'Cayman Islands' : 'კაიმანის კუნძულები', 'HaitiHaiti' : 'ჰაიტი', 'Namibia' : 'ნამიბია', 'Suriname' : 'სურინამი', 'Gabon' : 'გაბონი', 'Antigua and Barbuda' : 'ანტიგუა და ბარბუდა', 'Grenada' : 'გრენადა', 'Mozambique' : 'მოზამბიკი', 'Seychelles' : 'სეიშელის კუნძულები', 'Curaçao' : 'კიურასაო', 'Benin' : 'ბენინი', 'Eritrea' : 'ერიტრეა', 'Greenland' : 'გრენლანდია', 'Laos' : 'ლაოსი', 'Eswatini' : 'სვაზილენდი', 'Guyana' : 'გაიანა', 'Fiji' : 'ფიჯი', 'Montserrat' : 'მონსერატი', 'Myanmar' : 'მიანმარი', 'Syrian Arab Republic' : 'სირია', 'Cabo Verde' : 'კაბო-ვერდე', 'Angola' : 'ანგოლა', 'Congo' : 'კონგოს დემოკრატიული რესპუბლიკა', 'Guinea' : 'გვინეა', 'Vatican City' : 'Ქალაქი ვატიკანი', 'Sierra Leone' : 'სიერა-ლეონე', 'Mali' : 'მალი', 'Gambia' : 'გამბია', 'South Sudan' : 'სუდანი', 'Zimbabwe' : 'ზიმბაბვე', 'Nepal' : 'ნეპალი', 'CAR' : 'ცენტრალური აფრიკის რესპუბლიკა', 'Chad' : 'ჩადი', 'Liberia' : 'ლიბერია', 'Mauritania' : 'მავრიტანია', 'St. Barth' : 'წმინდა ბარტელიემი', 'Saint Lucia' : 'სენტ-ლუსია', 'Sint Maarten' : 'სინტ-მარტენი', 'Anguilla' : 'ანგვილა', 'Belize' : 'ბელიზი', 'Bhutan' : 'ბუტანი', 'British Virgin Islands' : 'ბრიტანეთის ვირჯინის კუნძულები', 'Guinea-Bissau' : 'გვინეა ბისავა', 'Nicaragua' : 'ნიკარაგუა', 'Saint Kitts and Nevis' : 'სენტ-კიტსი და ნევისი', 'Somalia' : 'სომალი', 'Turks and Caicos Islands' : 'თერქს-ქაიქოსის კუნძულები', 'Libya' : 'ლიბია', 'Papua New Guinea' : 'პაპუა-ახალი გვინეა', 'St. Vincent Grenadines' : 'სენტ-ვინსენტი და გრენადინები', 'Timor-Leste' : 'ტიმორ-ლესტე', 'Faroe Islands' : 'ფარერის კუნძულები'
    }

    let replacer = () => {
        String.prototype.allReplace = function(obj) {
            var retStr = this;
            for (var x in obj) {
                retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
            }
            return retStr;
        };
    }

    const countryGlob = document.getElementById('countryGlob');
    const allCasesGlob = document.getElementById('allCasesGlob');
    const newCasesGlob = document.getElementById('newCasesGlob');
    const newDeathGlob = document.getElementById('newDeathGlob');
    const allRecoveredGlob = document.getElementById('allRecoveredGlob');
    const nowCaseGlob = document.getElementById('nowCaseGlob');
    const allDeathGlob = document.getElementById('allDeathGlob');
    const allCriticalGlob = document.getElementById('allCriticalGlob');

    sendRequestGlobal('GET', url2)
        .then(() => {
            // const casesPerMillion = document.getElementById('casesPerOneMillion');
            const here = document.getElementById('here');
            for(i = 0; i < response.length; i++) {
                let result = response[i];

                replacer();
                result.country = result.country.allReplace(engToGeo);
                let format = new Intl.NumberFormat();
                

                here.innerHTML += `
                <td>${result.country}</td>
                <td>${format.format(result.cases)}</td>
                <td class="text-warning font-weight-bold">+${format.format(result.todayCases)}</td>
                <td>${format.format(result.deaths)}</td>
                <td class="text-danger font-weight-bold">+${format.format(result.todayDeaths)}</td>
                <td>${format.format(result.recovered)}</td>
                <td>${format.format(result.active)}</td>
                <td>${format.format(result.critical)}</td>
                `;
            }   

            let outside = () => {   
                let selectCountry = document.getElementById('selectCountry');
                let countryArr = [];
                for(i = 0; i < response.length; i++) {
                    let result = response[i];
                    countryArr.push(result.country);

                    replacer();

                    let selectCountryChild = `<option>${countryArr[i].allReplace(engToGeo)}</option>`;

                    selectCountry.innerHTML += selectCountryChild;
                }

                selectCountry.addEventListener('change', function (e) {
                    for(i = 0; i < response.length; i++) {
                        if (e.target.value == selectCountry.getElementsByTagName('option')[i].innerHTML) {
                            countryGlob.innerHTML = selectCountry.getElementsByTagName('option')[i].innerHTML;
                            allCasesGlob.innerHTML = response[i -1].cases.toLocaleString();
                            newCasesGlob.innerHTML = '+' + response[i -1].todayCases.toLocaleString();
                            newDeathGlob.innerHTML = '+' + response[i-1].todayDeaths.toLocaleString();
                            allRecoveredGlob.innerHTML = response[i-1].recovered.toLocaleString();
                            nowCaseGlob.innerHTML = response[i-1].active.toLocaleString();
                            allDeathGlob.innerHTML = response[i-1].deaths.toLocaleString();
                            allCriticalGlob.innerHTML = response[i-1].critical.toLocaleString();
                        } 
                    }
                });
            }
            outside();

        })
        .catch(err => console.log('Nothing Easy!'));

        let searchCountry = () => {
            let input, filter, table, tr, td, i, txtValue;
            input = document.getElementById("search");
            filter = input.value.toUpperCase();
            table = document.getElementById("here");
            tr = table.getElementsByTagName("tr");
            
            for (i = 0; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td")[0];
                if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                };
                };      
            };
        };


    let searchCountryGlob = () => {

        let input2, filter2, table2, tr2, td2, i2, txtValue2;
        input2 = document.getElementById("searchGlob");
        filter2 = input2.value.toUpperCase();
        table2 = document.getElementById("here");
        tr2 = table2.getElementsByTagName("tr");

        for (i2 = 0; i2 < tr2.length; i2++) {
            replacer()

        tr2[i2].getElementsByTagName("td")[0].innerHTML = tr2[i2].getElementsByTagName("td")[0].innerHTML.allReplace(engToGeo);
        
            td2 = tr2[i2].getElementsByTagName("td")[0];
            if (td2) {
                txtValue2 = td2.textContent || td2.innerText;
                if (txtValue2.toUpperCase().indexOf(filter2) > -1) {
                    countryGlob.innerHTML = tr2[i2].childNodes[0].innerHTML;
                    allCasesGlob.innerHTML = tr2[i2].childNodes[2].innerHTML;
                    newCasesGlob.innerHTML = tr2[i2].childNodes[4].innerHTML;
                    newDeathGlob.innerHTML = tr2[i2].childNodes[8].innerHTML;
                    allRecoveredGlob.innerHTML = tr2[i2].childNodes[10].innerHTML;
                    nowCaseGlob.innerHTML = tr2[i2].childNodes[12].innerHTML;
                    allDeathGlob.innerHTML = tr2[i2].childNodes[6].innerHTML;
                    allCriticalGlob.innerHTML = tr2[i2].childNodes[14].innerHTML;
                };
            }; 
        };
    };