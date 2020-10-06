<!DOCTYPE html>
<html lang="en">

    <?php include('lib/head.php'); ?>
    <meta http-equiv="refresh" content="300">
    <title>საქართველოს სტატისტიკა</title>
    <meta name="og:title" property="og:title" content="საქართველოს სტატისტიკა">
    <meta name="twitter:card" content="საქართველოს სტატისტიკა">
    <meta property="og:description" content="განახლებადი სტატისტიკა - დაავადებული, გამოჯანმრთელებული, გარდაცვლილი, კრიტიკული და სხვა...">
    <meta property="og:image" content="https://scontent.fkut1-1.fna.fbcdn.net/v/t1.0-9/90558519_108863944089497_5908640153248727040_o.jpg?_nc_cat=109&_nc_sid=dd9801&_nc_ohc=9H1J3nFAF_MAX8MfG4E&_nc_ht=scontent.fkut1-1.fna&oh=a577f87f653340175b4ead6f06018544&oe=5E9F61FF">
    <meta property="og:url" content="https://pandemic.ge/georgia.php">

    </head>

    <body class="sb-nav-fixed">
        <div id="fb-root"></div>
        <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v6.0"></script>
        <!-- <div id="layoutSidenav">
            <div id="layoutSidenav_content"> -->
            <?php include('lib/nav.php'); ?>
                  
                <main>
                    <div class="container shadow"><br>
                        <h3 class="heading">საქართველო</h3><br>
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
                                <span class="georgia">საქართველოს სტატისტიკა:</span>
                                <div class="row">
                                    <div class="col-xl-6 col-md-6">
                                        <div class="card bg-warning text-white mb-4 shadow">
                                            <div class="card-body font-weight-bold info">   
                                                <div id="allCasesGeo"></div>
                                                <div id="allCasesGeoPercent"></div>
                                            </div> 
                                            <div class="card-footer d-flex align-items-center justify-content-between">
                                                <div class="text-white small">სულ დაინფიცირებული</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-md-6">
                                        <div class="card bg-success text-white mb-4 shadow">
                                            <div class="card-body font-weight-bold info">
                                                <div id="allRecoveredGeo"></div>
                                                <div id="allRecoveredGeoPercent"></div>
                                            </div>
                                            <div class="card-footer d-flex align-items-center justify-content-between">
                                                <div class="text-white small">ჯამში გამოჯანმრთელებული</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-md-6">
                                        <div class="card bg-primary text-white mb-4 shadow">
                                            <div class="card-body font-weight-bold info">
                                                <div id="nowCaseGeo"></div>
                                                <div id="nowCasesGeoPercent"></div>
                                            </div>    
                                            <div class="card-footer d-flex align-items-center justify-content-between">
                                                <div class="text-white small">ამჟამად დაინფიცირებული</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-md-6">
                                        <div class="card bg-danger text-white mb-4 shadow">
                                            <div class="card-body font-weight-bold info">
                                                <div id="allDeathGeo"></div>
                                                <div id="allDeathGeoPercent"></div>
                                            </div>  
                                            <div class="card-footer d-flex align-items-center justify-content-between">
                                                <div class="text-white small">ჯამში გარდაცვლილი</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-md-6">
                                        <div class="card bg-info text-white mb-4 shadow">
                                            <div class="card-body font-weight-bold info">  
                                                <div id="newCasesGeo"></div>
                                                <div id="newCasesGeoPercent"></div>
                                            </div>  
                                            <div class="card-footer d-flex align-items-center justify-content-between">
                                                <div class="text-white small">ახალი დაინფიცირებული</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-md-6">
                                        <div class="card bg-danger text-white mb-4 shadow">
                                            <div class="card-body font-weight-bold info">
                                                <div id="newDeathGeo"></div>
                                                <div id="newDeathGeoPercent"></div>
                                            </div>
                                            <div class="card-footer d-flex align-items-center justify-content-between">
                                                <div class="text-white small">ახალი გარდაცვალება</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6 col-md-6">
                                        <div class="card bg-dark text-white mb-4 shadow">
                                            <div class="card-body font-weight-bold info">   
                                                <div id="allCriticalGeo"></div>
                                                <div id="allCriticalGeoPercent"></div>
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
                </main>
                <footer class="py-4 bg-light mt-auto">
                    <?php include('lib/footer.php'); ?>
                </footer>
            <!-- </div>
        </div> -->
        <?php include('lib/app.php'); ?>
        
        <script src="assets/js/staticgeo.js"></script>
    </body>
</html>
