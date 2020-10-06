  
sendRequestGlobal('GET', url3)
    .then(() => {
        //const casesPerMillion = document.getElementById('casesPerOneMillion');
        const allCasesGeo = document.getElementById('allCasesGeo');
        const newCasesGeo = document.getElementById('newCasesGeo');
        const newDeathGeo = document.getElementById('newDeathGeo');
        const allRecoveredGeo = document.getElementById('allRecoveredGeo');
        const nowCaseGeo = document.getElementById('nowCaseGeo');
        const allDeathGeo = document.getElementById('allDeathGeo');
        const allCriticalGeo = document.getElementById('allCriticalGeo');
        const georgiaPopulation = 3991542;
        const allCasesGeoPercent = document.getElementById('allCasesGeoPercent');
        const allRecoveredGeoPercent = document.getElementById('allRecoveredGeoPercent');
        const nowCasesGeoPercent = document.getElementById('nowCasesGeoPercent');
        const allDeathGeoPercent = document.getElementById('allDeathGeoPercent');
        const newCasesGeoPercent = document.getElementById('newCasesGeoPercent');
        const newDeathGeoPercent = document.getElementById('newDeathGeoPercent');
        const allCriticalGeoPercent = document.getElementById('allCriticalGeoPercent');
        
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