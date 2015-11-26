<?php
/**
* HtmlTemplateEditor
*/
class HtmlTemplateEditor 
{
  var $fileName;
  
  function __construct($fileName)
  {
    $this->fileName = $fileName;
    $this->controller();    
  }

  function display()
  {
    echo '<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>HTML template editor</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="controlBar">
      <div class="container">
        <div id="logo">HTML template editor</div>
          <a id="btn_edit" class="btn" href="#">Edit</a>
          <a id="btn_save"class="btn" href="#">Save</a>
          <a id="btn_dll" class="btn" href="?download">Download</a>
        </div>
      </div>
    <div id="statusBar">Saving data...</div>
    <div id="mailContent"></div>
    <script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
    <script src="app.js"></script>
</body>
</html>';
  }

  function controller()
  {
    if(isset($_POST["data"])){
      $this->save();
    }else if(isset($_GET["download"])){
      $this->download();
    }else{
      $this->display();
    }
  }

  function save()
  {
    $json =  $_POST["data"];
    json_decode($json);
    if(json_last_error()===JSON_ERROR_NONE){
      file_put_contents("data.json", $json);
    }
  }

  function download()
  {
    $json = file_get_contents("data.json");
    $html = file_get_contents("template.html");
    $data = json_decode($json);
    $html = $this->fill($data,$html);
    $fileName = $this->fileName.'-'.str_replace(" ", "_", $data->date).'.html';
    
    header("Cache-Control: private");
    header("Content-Type: application/stream");
    header("Content-Disposition: attachment; filename=".$fileName);

    echo $html;
  }

  function fill($data,$html)
  {
    $html = str_replace("{date}", $data->date, $html);

    foreach ($data->articles as $i => $article) {
      $html = str_replace("{article" . ($i+1) . ".title}", $article->title, $html);
      $html = str_replace("{article" . ($i+1) . ".description}", $article->description, $html);
      $html = str_replace("{article" . ($i+1) . ".source}", $article->source, $html);
    }
    return $html;
  }
}
?>