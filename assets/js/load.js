let hideLoadingDiv = () => {
    setTimeout(() => {
      document.getElementById('pg-load').style.display = 'none';
      document.getElementById('dataTables').style.display = '';
    },1000)
  }



  