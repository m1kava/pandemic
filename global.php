<!DOCTYPE html>
<html lang="en">

    <?php include('lib/head.php'); ?>
    <meta http-equiv="refresh" content="300">
    <title>მსოფლიოს სტატისტიკა</title>
    <meta name="og:title" property="og:title" content="მსოფლიოს სტატისტიკა">
    <meta name="twitter:card" content="მსოფლიოს სტატისტიკა">
    <meta property="og:description" content="განახლებადი სტატისტიკა - დაავადებული, გამოჯანმრთელებული, გარდაცვლილი, კრიტიკული და სხვა...">
    <meta property="og:image" content="https://scontent.fkut1-1.fna.fbcdn.net/v/t1.0-9/90558519_108863944089497_5908640153248727040_o.jpg?_nc_cat=109&_nc_sid=dd9801&_nc_ohc=9H1J3nFAF_MAX8MfG4E&_nc_ht=scontent.fkut1-1.fna&oh=a577f87f653340175b4ead6f06018544&oe=5E9F61FF">
    <meta property="og:url" content="https://pandemic.ge/global.php">

    </head>

    <body class="sb-nav-fixed" onload="hideLoadingDiv()">
        <div id="fb-root"></div>
        <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v6.0"></script>
        <!-- <div id="layoutSidenav">
            <div id="layoutSidenav_content"> -->
            <?php include('lib/nav.php'); ?>
                  
                <main>
                    <div class="container shadow"><br>
                        <h3 class="heading">სწრაფი სტატისტიკა</h3><br>
                        <ol class="breadcrumb">
                            <div id="566531087">
                                <script type="text/javascript">
                                    try {
                                        window._mNHandle.queue.push(function (){
                                            window._mNDetails.loadTag("566531087", "970x90", "566531087");
                                        });
                                    }
                                    catch (error) {}
                                </script>
                            </div>
                            <li class="breadcrumb-item active">(COVID-19)</li>
                        </ol>

                        <div class="row">
                            <div class="col-xl-8">
                                <span class="georgia">მსოფლიოს სტატისტიკა:</span>

                                <div class="row">
                                    <div class="col-xl-6 col-md-6">
                                        <div class="card bg-warning text-white mb-4 shadow">
                                            <div class="card-body font-weight-bold info">   
                                                <div id="allCases"></div>
                                                <div id="allCasesPercent"></div>
                                            </div> 
                                            <div class="card-footer d-flex align-items-center justify-content-between">
                                                <div class="text-white">სულ დაინფიცირებული</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-md-6">
                                        <div class="card bg-success text-white mb-4 shadow">
                                            <div class="card-body font-weight-bold info">
                                                <div id="allRecovered"></div>
                                                <div id="allRecoveredPercent"></div>
                                            </div>
                                            <div class="card-footer d-flex align-items-center justify-content-between">
                                                <div class="text-white">ჯამში გამოჯანმრთელებული</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-md-6">
                                        <div class="card bg-primary text-white mb-4 shadow">
                                            <div class="card-body font-weight-bold info">
                                                <div id="nowCase"></div>
                                                <div id="nowCasePercent"></div>
                                            </div>    
                                            <div class="card-footer d-flex align-items-center justify-content-between">
                                                <div class="text-white">ამჟამად დაინფიცირებული</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-md-6">
                                        <div class="card bg-danger text-white mb-4 shadow">
                                            <div class="card-body font-weight-bold info">
                                                <div id="allDeath"></div>
                                                <div id="allDeathPercent"></div>
                                            </div>  
                                            <div class="card-footer d-flex align-items-center justify-content-between">
                                                <div class="text-white">ჯამში გარდაცვლილი</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-md-6">
                                        <div class="card bg-info text-white mb-4 shadow">
                                            <div class="card-body font-weight-bold info">  
                                                <div id="newCase"></div>
                                                <div id="newCasePercent"></div>
                                            </div>  
                                            <div class="card-footer d-flex align-items-center justify-content-between">
                                                <div class="text-white">ახალი დაინფიცირებული</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-md-6">
                                        <div class="card bg-danger text-white mb-4 shadow">
                                            <div class="card-body font-weight-bold info">
                                                <div id="newDeath"></div>
                                                <div id="newDeathPercent"></div>
                                            </div>
                                            <div class="card-footer d-flex align-items-center justify-content-between">
                                                <div class="text-white">ახალი გარდაცვალება</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-md-6">
                                        <div class="card bg-dark text-white mb-4 shadow">
                                            <div class="card-body font-weight-bold info">   
                                                <div id="allCritical"></div>
                                                <div id="allCriticaPercent"></div>
                                            </div> 
                                            <div class="card-footer d-flex align-items-center justify-content-between">
                                                <div class="text-white">კრიტიკული</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-xl-4">
                                <?php include('lib/aside.php'); ?>
                            </div>
                        </div>
                        <div class="sharethis-inline-share-buttons"></div><br>
                    </div></br>

                    <div class="container-fluid">
                        <div class="col-xl-12">
                            <div class="card-header" style="background-color: #f8f9fa">
                                <i class="mr-1"></i>ფილტრაცია ქვეყნის მიხედვით, შეიყვანეთ ქვეყანა: <input type="text" id="search" class="col-xl-6 bl-12 bgdark" onkeyup="searchCountry()" placeholder="მაგალითად: საქართველო" title="შეიყვანეთ ქვეყანა">
                            </div>
                            <table style="display: none;" class="table table-bordered cust-table header-fixed" id="dataTables" width="100%" cellspacing="0">
                                <thead class='thead-dark'>
                                    <tr>
                                        <th></th>
                                        <th>სულ დაინფიცირებული</th>
                                        <th>ახალი დაინფიცირებული</th>
                                        <th>გარდაცვლილი</th>
                                        <th>ახალი გარდაცვალება</th>
                                        <th>გამოჯანმრთელებული</th>
                                        <th>აქტიური</th>
                                        <th>კრიტიკული</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th></th>
                                        <th>სულ დაინფიცირებული</th>
                                        <th>ახალი დაინფიცირებული</th>
                                        <th>გარდაცვლილი</th>
                                        <th>ახალი გარდაცვალება</th>
                                        <th>გამოჯანმრთელებული</th>
                                        <th>აქტიური</th>
                                        <th>კრიტიკული</th>
                                    </tr>
                                </tfoot>
                                <tbody id="here">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
                <footer class="py-4 bg-light mt-auto">
                    <?php include('lib/footer.php'); ?>
                </footer>
            <!-- </div>
        </div> -->
        <div class="pg-load" id="pg-load">
            <div class="loader">იტვირთება</div>
        </div>

        <?php include('lib/app.php'); ?>
        
        <script src="assets/js/static.js"></script>
        <script src="assets/js/load.js"></script>
        <script src="assets/js/global.js"></script>
    </body>
</html>
