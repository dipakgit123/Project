      var express = require("express");
      var router = express.Router();
      var exe =require("./connection");

      

      router.get("/",async function(req,res){

     if(req.session.admin_id == undefined)
   res.redirect("/admin/login");
    else
res.render("admin/home.ejs")
          
      });
 

      router.get("/revenue",async function(req,res){

        var year = new Date().getFullYear();
        var jan_data = await exe(`SELECT COUNT(user_courses_id) as ttl FROM user_course WHERE purchase_date LIKE '${year}-01-%'`);
        var feb_data = await exe(`SELECT COUNT(user_courses_id) as ttl FROM user_course WHERE purchase_date LIKE '${year}-02-%'`);
        var mar_data = await exe(`SELECT COUNT(user_courses_id) as ttl FROM user_course WHERE purchase_date LIKE '${year}-03-%'`);
        var apr_data = await exe(`SELECT COUNT(user_courses_id) as ttl FROM user_course WHERE purchase_date LIKE '${year}-04-%'`);
        var may_data = await exe(`SELECT COUNT(user_courses_id) as ttl FROM user_course WHERE purchase_date LIKE '${year}-05-%'`);
        var jun_data = await exe(`SELECT COUNT(user_courses_id) as ttl FROM user_course WHERE purchase_date LIKE '${year}-06-%'`);
        var jul_data = await exe(`SELECT COUNT(user_courses_id) as ttl FROM user_course WHERE purchase_date LIKE '${year}-07-%'`);
        var aug_data = await exe(`SELECT COUNT(user_courses_id) as ttl FROM user_course WHERE purchase_date LIKE '${year}-08-%'`);
        var sep_data = await exe(`SELECT COUNT(user_courses_id) as ttl FROM user_course WHERE purchase_date LIKE '${year}-09-%'`);
        var oct_data = await exe(`SELECT COUNT(user_courses_id) as ttl FROM user_course WHERE purchase_date LIKE '${year}-10-%'`);
        var nov_data = await exe(`SELECT COUNT(user_courses_id) as ttl FROM user_course WHERE purchase_date LIKE '${year}-11-%'`);
        var dec_data = await exe(`SELECT COUNT(user_courses_id) as ttl FROM user_course WHERE purchase_date LIKE '${year}-12-%'`);
  
       var obj = {'jan':jan_data[0].ttl,'feb':feb_data[0].ttl,'mar':mar_data[0].ttl,'apr':apr_data[0].ttl,'may':may_data[0].ttl,'jun':jun_data[0].ttl,'jul':jul_data[0].ttl,
       'aug':aug_data[0].ttl,'sep':sep_data[0].ttl,'oct':oct_data[0].ttl,'nov':nov_data[0].ttl,'dec':dec_data[0].ttl}
      res.render("admin/revenue.ejs",obj)
        });
router.get("/manage_slider",async function(req,res){

    var data = await exe("SELECT * FROM slider");
    var obj = {"slides":data};
    res.render("admin/manage_slider.ejs",obj);
});

router.post("/save_slider",async function(req,res){
    const today = new Date();
    var time = today.getTime();

    var file_name = time+req.files.slider_image.name;

    req.files.slider_image.mv("public/upload/"+file_name);

    //await exe(`CREATE TABLE slider(slider_id INT PRIMARY KEY AUTO_INCREMENT,slider_image TEXT,slider_title TEXT,slider_button_text VARCHAR(50),slider_button_link TEXT)`)
    var d = req.body;
    await exe(`INSERT INTO slider(slider_image,slider_title,slider_button_text,slider_button_link) VALUES ('${file_name}','${d.slider_title}','${d.slider_button_text}','${d.slider_button_link}')`)
   // res.send(file_name)
  res.redirect("/admin/manage_slider");
})

router.get("/manage_category",async function(req,res){
    var data = await exe(`SELECT * FROM category1`);
    var obj = {"cats":data};
    res.render("admin//manage_category.ejs",obj);
});

router.post("/save_category",function(req,res){
  // exe(`CREATE TABLE category1(category_id INT PRIMARY KEY AUTO_INCREMENT,category_name VARCHAR(200),category_details TEXT)`);
  var details = req.body.category_details.replace("'","\\'");
  var name = req.body.category_name.replace("'","\\'");

  exe(`INSERT INTO category1(category_name,category_details) VALUES('${name}','${details}')`);
  // res.send(req.body);
  res.redirect("/admin/manage_category");
});

router.get("/add_course",async function(req,res){
  var data = await exe(`SELECT * FROM category1`);
  var obj = {"cat_list":data};
  res.render("admin/add_course.ejs",obj);
});


router.post("/save_course", async function(req,res){

  const today = new Date();
    var time = today.getTime();

    console.log(req.body);
    console.log(req.files);

    var img_name = time+req.files.course_image.name;
    req.files.course_image.mv("public/upload/"+img_name);
    var video_name="";
    if(req.files.course_sample_video !=undefined)
    {
      video_name = time+req.files.course_sample_video.name;
      req.files.course_sample_video.mv("public/upload/"+video_name);
    }
    //CREATE TABLE course_tbl(course_id INT PRIMARY KEY AUTO_INCREMENT,course_name TEXT,course_category_id INT,course_duration VARCHAR(200),course_price VARCHAR(20),course_image TEXT,course_sample_video TEXT,course_mentor VARCHAR(200),course_link TEXT,course_platform VARCHAR(100),course_details TEXT)
 
      var d =req.body;
      var course_name = d.course_name.replace("'","\\'");
      var course_details = d.course_details.replace("'","\\'");

      var sql = `INSERT INTO course_tbl(course_name,course_category_id,course_duration,course_price, course_image,course_sample_video,course_mentor,course_link,course_platform,course_details )VALUES ('${course_name}','${d.course_category_id}','${d.course_duration}','${d.course_price}','${img_name}','${video_name}','${d.course_mentor}','${d.course_link}','${d.course_platform}','${course_details}')`;
      await exe(sql);
      res.send("done");
});

    router.get("/course_list", async function(req,res){
      
      var data = await exe(`SELECT * FROM course_tbl,category1 WHERE course_tbl.course_category_id = category1.category_id`);
      var obj = {"course_list":data};
      res.render("admin/course_list.ejs",obj);
    });

    router.get("/course_details/:id",async function(req,res){
      var id =req.params.id;
      var data = await exe(`SELECT * FROM course_tbl,category1 WHERE course_tbl.course_category_id = category1.category_id AND course_id = '${id}'`);
      var obj = {"c_det":data}
      res.render("admin/course_details.ejs",obj);
     // res.send("hello")
    });

    router.get("/all_user_list",async function(req,res){
      var data = await exe(`SELECT * FROM user_tbl`)
      var obj = {"all_list":data}
      res.render("admin/all_user_list.ejs",obj)
    });

    router.get("/sold_courses",async function(req,res){

      var sql = `SELECT amount,purchase_date,user_name,course_name,transaction_id FROM user_course,user_tbl,course_tbl WHERE user_course.user_id=user_tbl.user_id AND user_course.course_id = course_tbl.course_id`;
      var data= await exe(sql);
      var obj = {"sold_list":data};
      res.render("admin/sold_courses.ejs",obj)
    });

    router.get("/login",function(req,res){
      
      res.render("admin/login.ejs")
    });

    router.get("/logout",function(req,res){
    
      res.render("admin/login.ejs")
    })

    router.post("/admin_login_process",async function(req,res){
      var sql = `SELECT * FROM admin WHERE admin_email ='${req.body.admin_email}' AND admin_password = '${req.body.admin_password}'`;
      
      var data = await exe(sql);
      if(data.length > 0)
      {
        req.session.admin_id = data[0].admin_id;
        res.redirect("/admin")
      }
      else
      {
        res.send("Login Failed")
      }
    })

  router.get("/contact_list",async function(req,res){
    var data = await exe(`SELECT * FROM student`)
    var obj = {"contact_list":data}
    res.render("admin/contact_list.ejs",obj)
  });

  router.get("/mentor",async function (req,res){
    var data = await exe("SELECT * FROM mentor");
    var obj = {"mentor":data};
    res.render("admin/mentor.ejs",obj);
  });

  router.post("/save_mentor",async function(req,res){
    var file_name = req.files.mentor_image.name;
    req.files.mentor_image.mv("public/upload/"+file_name);

    var d = req.body;

    await exe(`INSERT INTO mentor(mentor_id,mentor_image,mentor_name,mentor_country,mentor_description) VALUES ('${d.mentor_id}','${file_name}','${d.mentor_name}','${d.mentor_country}','${d.mentor_description}')`)
    res.redirect("/admin/mentor")
  });

  router.get("/delete_slider/:id",async function(req,res){
    var id = req.params.id;
    await exe(`DELETE FROM slider WHERE slider_id = '${id}'`);
    res.redirect("/admin/manage_slider");
  })

  
  router.get("/delete_category/:id",async function(req,res){
    var id = req.params.id;
    await exe(`DELETE FROM category1 WHERE category_id = '${id}'`);
    res.redirect("/admin/manage_category");
  })

  router.get("/delete_course/:id",async function(req,res){
    var id = req.params.id;
    await exe(`DELETE FROM course_tbl WHERE course_id = '${id}'`);
    res.redirect("/admin/course_list");
  })

  router.get("/delete_mentor/:id",async function(req,res){
    var id = req.params.id;
    await exe(`DELETE FROM mentor WHERE mentor_id = '${id}'`);
    res.redirect("/admin/mentor");
  })
module.exports=router;