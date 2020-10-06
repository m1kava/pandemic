sendRequestGlobal('GET', url)
    .then(() => {
        const allCases = document.getElementById('allCases'),
              allDeath = document.getElementById('allDeath'),
              allRecoverd = document.getElementById('allRecovered'),
              nowCase = document.getElementById('nowCase'),
              newCase = document.getElementById('newCase'),
              newDeath = document.getElementById('newDeath'),
              allCritical = document.getElementById('allCritical'),
              allDeathPercent = document.getElementById('allDeathPercent'),
              allRecoveredPercent = document.getElementById('allRecoveredPercent'),
              worldPopulation = 7773763312,
              allCasesPercent = document.getElementById('allCasesPercent'),
              nowCasePercent = document.getElementById('nowCasePercent'),
              newCasePercent = document.getElementById('newCasePercent'),
              newDeathPercent = document.getElementById('newDeathPercent'),
              allCriticaPercent = document.getElementById('allCriticaPercent');


        allCases.innerHTML = response.cases.toLocaleString();
        allDeath.innerHTML = response.deaths.toLocaleString();
        allRecoverd.innerHTML = response.recovered.toLocaleString();
        nowCase.innerHTML = response.active.toLocaleString();
        newCase.innerHTML = response.todayCases.toLocaleString();
        newDeath.innerHTML = response.todayDeaths.toLocaleString();
        allCritical.innerHTML = response.critical.toLocaleString();

        let recoveredPercent = (response.recovered / response.cases) * 100;
        let deathPercent = (response.deaths / response.cases) * 100;
        allDeathPercent.innerHTML = deathPercent.toFixed(2) + '%';
        allRecoveredPercent.innerHTML = recoveredPercent.toFixed(2) + '%';

        let worldPercent = (response.cases / worldPopulation) * 100;
        allCasesPercent.innerHTML = worldPercent.toFixed(4) + '%';

        let worldCasePercent = (response.active / worldPopulation) * 100;
        nowCasePercent.innerHTML = worldCasePercent.toFixed(4) + '%';

        let worldnewCasePercent = (response.todayCases / response.cases) * 100;
        newCasePercent.innerHTML = worldnewCasePercent.toFixed(4) + '%';

        let worldnewDeathPercent = (response.todayDeaths / response.cases) * 100;
        newDeathPercent.innerHTML = worldnewDeathPercent.toFixed(4) + '%';

        let  worldallCriticaPercent = (response.critical / response.cases) * 100;
        allCriticaPercent.innerHTML = worldallCriticaPercent.toFixed(4) + '%';
        
    })
    .catch(err => console.log(err));
