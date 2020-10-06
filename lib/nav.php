<nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
    <div class="container">
        <a class="navbar-brand" href="/">Pandemic.Ge</a>
       <!-- <span class="navbar-text d-xs-block d-sm-block d-md-block d-lg-none d-xl-none">
            <a href="/en">ENG</a> | 
            <a href="../">ქარ</a>
        </span> -->
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarText">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item <?php echo ($_SERVER['PHP_SELF'] == "z/index.php" ? "active" : "");?>">
                    <a class="nav-link" href="index.php">ქვეყნები</a>
                </li>
                <li class="nav-item <?php echo ($_SERVER['PHP_SELF'] == "/georgia.php" ? "active" : "");?>">
                    <a class="nav-link" href="georgia.php">საქართველო</a>
                </li>
                <li class="nav-item <?php echo ($_SERVER['PHP_SELF'] == "/global.php" ? "active" : "");?>">
                    <a class="nav-link" href="global.php">მსოფლიო & ცხრილი</a>
                </li>
                <li class="nav-item <?php echo ($_SERVER['PHP_SELF'] == "/posts.php" ? "active" : "");?>">
                    <a class="nav-link" href="posts.php">ბლოგი</a>
                </li>
            </ul>
        </div>
        <!-- <span class="navbar-text d-none d-sm-none d-md-none d-lg-block d-xl-block">
            <a href="/en">ENG</a> | 
            <a href="../">ქარ</a>
        </span> -->
    </div>
</nav><br>