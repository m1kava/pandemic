  
sendRequestGlobal('GET', url3)
    .then(() => {
        //const casesPerMillion = document.getElementById('casesPerOneMillion');
        const allCasesGeo = document.getElementById('allCasesGeo'),
              newCasesGeo = document.getElementById('newCasesGeo'),
              newDeathGeo = document.getElementById('newDeathGeo'),
              allRecoveredGeo = document.getElementById('allRecoveredGeo'),
              nowCaseGeo = document.getElementById('nowCaseGeo'),
              allDeathGeo = document.getElementById('allDeathGeo'),
              allCriticalGeo = document.getElementById('allCriticalGeo'),
              georgiaPopulation = 3991542;
              allCasesGeoPercent = document.getElementById('allCasesGeoPercent'),
              allRecoveredGeoPercent = document.getElementById('allRecoveredGeoPercent'),
              nowCasesGeoPercent = document.getElementById('nowCasesGeoPercent'),
              allDeathGeoPercent = document.getElementById('allDeathGeoPercent'),
              newCasesGeoPercent = document.getElementById('newCasesGeoPercent'),
              newDeathGeoPercent = document.getElementById('newDeathGeoPercent'),
              allCriticalGeoPercent = document.getElementById('allCriticalGeoPercent');
        
        allCasesGeo.innerHTML = response.cases;
        newCasesGeo.innerHTML = response.todayCases;
        newDeathGeo.innerHTML = response.todayDeaths;
        allRecoveredGeo.innerHTML = response.recovered;
        nowCaseGeo.innerHTML = response.active;
        allDeathGeo.innerHTML = response.deaths;
        allCriticalGeo.innerHTML = response.critical;
        let allCasesPercent = (response.cases / georgiaPopulation) * 100;
        let nowCasesPercent = (response.active / georgiaPopulation) * 100;
        allCasesGeoPercent.innerHTML = allCasesPercent.toFixed(4) + '%';
        let closedPercentGeo = response.cases - response.deaths - response.recovered;
        let recoveredGeo = (response.recovered / response.cases) * 100;
        let deathGeo = (response.deaths / response.cases) * 100;
        allRecoveredGeoPercent.innerHTML = recoveredGeo.toFixed(2) + '%';
        allDeathGeoPercent.innerHTML = deathGeo.toFixed(2) + '%';
        nowCasesGeoPercent.innerHTML = nowCasesPercent.toFixed(4) + '%';
        let newCasesPercent = (response.todayCases / response.active) * 100;
        newCasesGeoPercent.innerHTML = newCasesPercent.toFixed(2) + '%';
        let newDeathPercent = (response.todayDeaths / response.active) * 100;
        newDeathGeoPercent.innerHTML = newDeathPercent.toFixed(2) + '%';
        let criticalPercent = (response.critical / response.active) * 100;
        allCriticalGeoPercent.innerHTML = criticalPercent.toFixed(2) + '%';
        //casesPerMillion.innerHTML = response.casesPerOneMillion;
    })
.catch(err => console.log(err)); 