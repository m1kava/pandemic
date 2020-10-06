<!DOCTYPE html>
<html lang="en">

    <?php include('lib/head.php'); ?>
    <title>ბლოგი</title>
    <meta name="og:title" property="og:title" content="ბლოგი">
    <meta name="twitter:card" content="ბლოგი">
    <meta property="og:description" content="განახლებადი სტატისტიკა - დაავადებული, გამოჯანმრთელებული, გარდაცვლილი, კრიტიკული და სხვა...">
    <meta property="og:image" content="https://scontent.fkut1-1.fna.fbcdn.net/v/t1.0-9/90558519_108863944089497_5908640153248727040_o.jpg?_nc_cat=109&_nc_sid=dd9801&_nc_ohc=9H1J3nFAF_MAX8MfG4E&_nc_ht=scontent.fkut1-1.fna&oh=a577f87f653340175b4ead6f06018544&oe=5E9F61FF">
    <meta property="og:url" content="https://pandemic.ge/posts.php">

    </head>

    <body class="sb-nav-fixed">
        <div id="fb-root"></div>
        <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v6.0"></script>
        <!-- <div id="layoutSidenav">
            <div id="layoutSidenav_content"> -->
            <?php include('lib/nav.php'); ?>

                <main>
                    <div class="container shadow"><br>
                        <h3 class="heading">ბლოგი</h3><br>
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item active">(COVID-19)</li>
                        </ol>

                        <div class="row">
                            <div class="col-xl-8">
                                <div class="row">
                                    <div class="col-xl-6 col-md-6" style="margin-bottom: 25px;"> 
                                        <div class="card">
                                            <img class="card-img-top" src="assets/img/prev.jpg" alt="Card image cap">
                                            <div class="card-body">
                                                <h5 class="card-title">სიმპტომები</h5>
                                                <p class="card-text">ადამიანი შეიძლება დაავადდეს ვირუსით 1-დან 14 დღით ადრე, სიმპტომების განვითარებამდე. კორონავირუსის დაავადების ყველაზე გავრცელებული სიმპტომებია: სიცხე, ...</p>
                                                <a href="symptoms.php" class="btn btn-info">სრულად ნახვა</a>
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
