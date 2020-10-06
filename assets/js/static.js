sendRequestGlobal('GET', url)
    .then(() => {
        const allCases = document.getElementById('allCases');
        const allDeath = document.getElementById('allDeath');
        const allRecoverd = document.getElementById('allRecovered');
        const nowCase = document.getElementById('nowCase');
        const newCase = document.getElementById('newCase');
        const newDeath = document.getElementById('newDeath');
        const allCritical = document.getElementById('allCritical');

        const allDeathPercent = document.getElementById('allDeathPercent');
        const allRecoveredPercent = document.getElementById('allRecoveredPercent');
        const worldPopulation = 7773763312;
        const allCasesPercent = document.getElementById('allCasesPercent');
        const nowCasePercent = document.getElementById('nowCasePercent');
        const newCasePercent = document.getElementById('newCasePercent');
        const newDeathPercent = document.getElementById('newDeathPercent');
        const allCriticaPercent = document.getElementById('allCriticaPercent');


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
