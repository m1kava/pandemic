<!DOCTYPE html>
<html lang="en">

    <?php include('lib/head.php'); ?>
    <title>სიმპტომები</title>
    <meta name="og:title" property="og:title" content="სიმპტომები">
    <meta name="twitter:card" content="სიმპტომები">
    <meta property="og:description" content="ადამიანი შეიძლება დაავადდეს ვირუსით 1-დან 14 დღით ადრე...">
    <meta property="og:image" content="https://scontent.fkut1-1.fna.fbcdn.net/v/t1.0-9/90558519_108863944089497_5908640153248727040_o.jpg?_nc_cat=109&_nc_sid=dd9801&_nc_ohc=9H1J3nFAF_MAX8MfG4E&_nc_ht=scontent.fkut1-1.fna&oh=a577f87f653340175b4ead6f06018544&oe=5E9F61FF">
    <meta property="og:url" content="https://pandemic.ge/symptoms.php">

    </head>

    <body class="sb-nav-fixed">
        <div id="fb-root"></div>
        <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v6.0"></script>
        <!-- <div id="layoutSidenav">
            <div id="layoutSidenav_content"> -->
            <?php include('lib/nav.php'); ?>

                <main>
                    <div class="container shadow"><br>
                        <h3 class="heading">სიმპტომები</h3><br>
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item active">(COVID-19)</li>
                        </ol>

                        <div class="row">
                            <div class="col-xl-8">
                                <div class="row">
                                    <div class="col-12" style="margin-bottom: 25px;"> 
                                        <div class="card">
                                            <img class="card-img-top" src="assets/img/prev.jpg" alt="Card image cap">
                                            <div class="card-body">
                                                <p>ადამიანი შეიძლება დაავადდეს ვირუსით 1-დან 14 დღით ადრე, სიმპტომების განვითარებამდე. კორონავირუსის დაავადების ყველაზე გავრცელებული სიმპტომებია: სიცხე, დაღლილობა და მშრალი ხველა.</p>
                                                <p>ადამიანების უმეტესობა (დაახლოებით 80%) გამოჯანმრთელდა დაავადებით, სპეციალური მკურნალობა არ საჭიროებს.</p>
                                                <p>უფრო იშვიათად, დაავადება შეიძლება სერიოზული და ფატალურიც კი იყოს. ხანდაზმული ადამიანები და სხვა დაავადების მქონე პირები (მაგალითად, ასთმა, დიაბეტი ან გულის დაავადება) შეიძლება უფრო დაუცველი აღმოჩნდნენ.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div class="row">
                                    <div class="col-xl-6 col-md-6">
                                       
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

        <?php include('lib/app.php'); ?>

    </body>
</html>
