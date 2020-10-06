<!DOCTYPE html>
<html lang="en">

    <?php include('lib/head.php'); ?>
    <meta http-equiv="refresh" content="300">
    <title>კორონა ვირუსის სტატისტიკა</title>
    <meta name="og:title" property="og:title" content="კორონა ვირუსის სტატისტიკა">
    <meta name="twitter:card" content="კორონა ვირუსის სტატისტიკა">
    <meta property="og:description" content="განახლებადი სტატისტიკა - დაავადებული, გამოჯანმრთელებული, გარდაცვლილი, კრიტიკული და სხვა...">
    <meta property="og:image" content="https://scontent.fkut1-1.fna.fbcdn.net/v/t1.0-9/90558519_108863944089497_5908640153248727040_o.jpg?_nc_cat=109&_nc_sid=dd9801&_nc_ohc=9H1J3nFAF_MAX8MfG4E&_nc_ht=scontent.fkut1-1.fna&oh=a577f87f653340175b4ead6f06018544&oe=5E9F61FF">
    <meta property="og:url" content="https://pandemic.ge">

    </head>

    <body class="sb-nav-fixed" onload="hideLoadingDiv()">
        <div id="fb-root"></div>
        <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v6.0"></script>
        <!-- <div id="layoutSidenav">
            <div id="layoutSidenav_content"> -->
            <?php include('lib/nav.php'); ?>

                <main>
                    <div class="container shadow"><br>
                        <h3 class="heading">ქვეყნები</h3><br>
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item active">(COVID-19)</li>
                        </ol>

                        <div class="row">
                            <div class="col-xl-8">
                                <div class="row">
                                    <div class="col-12">
                                        <span class="georgia">შეიყვანეთ ქვეყანა ან აირჩიეთ სიიდან:</span> 
                                        <nav class="navbar navbar-light bg-info changeonsm" style="height: 70px;">
                                                <form class="col-xl-6 col-md-6">
                                                    <div class="autocomplete" style="width: 100%;">
                                                        <input autocomplete="off" style="width: 100%;" class="form-control" id="searchGlob" name="myCountry" type="search" onkeyup="searchCountryGlob()" placeholder="მაგალითად: საქართველო" aria-label="ძებნა">
                                                    </div>
                                                </form>
            
                                                <div class="col-xl-6 col-md-6">
                                                    <select class="form-control" id="selectCountry" style="cursor: pointer; width: 100%;">
                                                        <option value="">აირჩიეთ ქვეყანა</option>
                                                    </select>
                                                </div>
                                            <div id="clh"></div>
                                        </nav><br>
                                    </div>
                                </div>


                                <div class="row">
                                    <div class="col-xl-6 col-md-6">
                                        <div class="card bg-secondary text-white mb-4 shadow">
                                            <div class="card-body font-weight-bold infoGl">
                                                <div id="countryGlob">შეიყვანეთ ქვეყანა</div>
                                                <div id="countryGlobPercent"></div>
                                            </div>
                                            <div class="card-footer d-flex align-items-center justify-content-between">
                                                <div class="text-white small">ქვეყანა</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-md-6">
                                        <div class="card bg-warning text-white mb-4 shadow">
                                            <div class="card-body font-weight-bold infoGl">    
                                                <div id="allCasesGlob">შეიყვანეთ ქვეყანა</div>
                                                <div id="allCasesGlobPercent"></div>
                                            </div>
                                            <div class="card-footer d-flex align-items-center justify-content-between">
                                                <div class="text-white small">სულ დაინფიცირებული</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-md-6">
                                        <div class="card bg-info text-white mb-4 shadow">
                                            <div class="card-body font-weight-bold infoGl">    
                                                <div id="newCasesGlob">შეიყვანეთ ქვეყანა</div>
                                                <div id="newCasesGlobPercent"></div>
                                            </div>
                                            <div class="card-footer d-flex align-items-center justify-content-between">
                                                <div class="text-white small">ახალი დაინფიცირებული</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-md-6">
                                        <div class="card bg-danger text-white mb-4 shadow">
                                            <div class="card-body font-weight-bold infoGl">    
                                                <div id="newDeathGlob">შეიყვანეთ ქვეყანა</div>
                                                <div id="newDeathGlobPercent"></div>
                                            </div>
                                            <div class="card-footer d-flex align-items-center justify-content-between">
                                                <div class="text-white small">ახალი გარდაცვლილი</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-md-6">
                                        <div class="card bg-success text-white mb-4 shadow">
                                            <div class="card-body font-weight-bold infoGl">    
                                                <div id="allRecoveredGlob">შეიყვანეთ ქვეყანა</div>
                                                <div id="allRecoveredGlobPercent"></div>
                                            </div>
                                            <div class="card-footer d-flex align-items-center justify-content-between">
                                                <div class="text-white small">ჯამში გამოჯანმრთელებული</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-md-6">
                                        <div class="card bg-primary text-white mb-4 shadow">
                                            <div class="card-body font-weight-bold infoGl">    
                                                <div id="nowCaseGlob">შეიყვანეთ ქვეყანა</div>
                                                <div id="nowCasesGlobPercent"></div>
                                            </div>
                                            <div class="card-footer d-flex align-items-center justify-content-between">
                                                <div class="text-white small">ამჟამად დაინფიცირებული</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-md-6">
                                        <div class="card bg-danger text-white mb-4 shadow">
                                            <div class="card-body font-weight-bold infoGl">    
                                                <div id="allDeathGlob">შეიყვანეთ ქვეყანა</div>
                                                <div id="allDeathGlobPercent"></div>
                                            </div>
                                            <div class="card-footer d-flex align-items-center justify-content-between">
                                                <div class="text-white small">ჯამში გარდაცვლილი</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-md-6">
                                        <div class="card bg-dark text-white mb-4 shadow">
                                            <div class="card-body font-weight-bold infoGl">    
                                                <div id="allCriticalGlob">შეიყვანეთ ქვეყანა</div>
                                                <div id="allCriticalGlobPercent"></div>
                                            </div>
                                            <div class="card-footer d-flex align-items-center justify-content-between">
                                                <div class="text-white small">კრიტიკული</div>
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
                        
                    </div><br>

                    <div class="container-fluid" style="display:none">
                        <table style="display: none;" id="dataTables">
                            <tbody id="here"></tbody>
                        </table>
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

        <script src="assets/js/load.js"></script>
        <script src="assets/js/global.js"></script>
    </body>
</html>