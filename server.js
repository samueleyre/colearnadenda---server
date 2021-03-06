
 var request = require("request");
 var fs = require('fs');
 var fileName = './events.json';
 var meetups = './meetupUrls.json';
 var typesJson = './types.json';
 var file = require(fileName);
 var meetupUrls = require(meetups);
 var types = require(typesJson);





//000000000000000000000000000000000       htmltojson

 function searchElements(maRegex, str) {

   var monTableau;
   var values = [];
     while ((monTableau = maRegex.exec(str)) !== null) {
       values.push(monTableau[1]);
     }
     return values;
 }

 function findUrl(str) {

 var maRegex = /<a href="(.+?)" class="url omnCamp omnrv_rv3">/g;

 return searchElements(maRegex, str);

 }


 function findTitle(str) {

 var maRegex = /<span class="eventName summary">\n(.+?)\n<\/span>/g;
 return searchElements(maRegex, str);

 }

 function findLocation(str) {

 var maRegex = /<a href="(.+?)" class="url omnCamp omnrv_rv3">/g;
 return searchElements(maRegex, str);

 }

 function findTime(str) {

 var maRegex = /<span title=".+?">(.+?)<\/span><\/abbr>/g;
 return searchElements(maRegex, str);

 }

 function findFullDate(str) {

 var maRegex = /<abbr title="(.+?)" class="dtstart dtstamp time">/g;
 return searchElements(maRegex, str);

 }



function pushEvents(newEvents, type1, type2, title, fullDate, url, time, image) {
    newEvents.push({
        "title" : title,
        "img": image,
        "location": "lyon",
        "link": url,
        "type1": type1,
        "type2": type2,
        "time": time,
        "fulldate": fullDate
    });
    return newEvents;
}


 function dateToIso(date) {
     // ex: 20160405T053000Z";
     var year = date.slice(0,4);
     var month = date.slice(4,6);
     var day = date.slice(6,8);
     // var h = date.slice(9, 11);
     // var m = date.slice(11, 13);
     // var s = date.slice(13, 15);
     // return year+"-"+month+"-"+day+"T"+h +":"+m+":"+s+"Z";
     return year+"-"+month+"-"+day+"T00:00:00Z";
     // ex:  2016-04-22T09:44:16Z
 }

 // function isoDateToDateStr(isoDate) {
 //     var d = new Date(isoDate);
 //     var options = {weekday: "long", year: "numeric", month: "long", day: "numeric"};
 //     return d.toLocaleString("fr",options);
 // }


 function createJson(result) {

     var events =  [];
     var url = findUrl(result);
     var fullDate = findFullDate(result);
     var title = findTitle(result);
     var location = findLocation(result);
     var time = findTime(result);
     var dates = [];
     var uniqueDates = [];
     var newEvents = [];
     var currentDate = new Date();
     currentDate = currentDate.toISOString();

     for (var i = 0 ; i < fullDate.length; i++) {
         var date = fullDate[i].slice(0,8);
         date = dateToIso(date);
         dates.push(date);
         fullDate[i] = date;
     }

     for (  i = 0; i < url.length; i++) {
         // console.log(i);
         var type1 = "";
         var type2 = "";
         var image = "";
         if((/(\bnodeschool|angular|phpschool|dessiner|english|language|chanter|couture|franglish)/gi).exec(title[i])) {
             for (  j = 0; j < types.title.length; j++) {
                if((/(\bnodeschool|angular|phpschool|dessiner|english|language|chanter|couture|franglish)/gi).exec(title[i])[0].toLowerCase() === types.title[j].title) {
                    type1 = types.title[j].type1;
                    type2 = types.title[j].type2;
                    image = types.title[j].image;
                }
             }
             if ((/(italian|cooking|choeur)/gi).exec(url[i]) && type1 === "") {
                for ( var k = 0; k < types.url.length; k++) {
                     if ((/(italian|cooking|choeur)/gi).exec(url[i])[0].toLowerCase() === types.url[k].title) {
                         // console.log(i);
                         // console.log(url[i]);
                         console.log(types.url[k].title);
                         type1 = types.url[k].type1;
                         type2 = types.url[k].type2;
                         image = types.url[k].image;
                     }
                }
             }


         // if((/(\bnodeschool|angular|phpschool|dessiner|english|language|chanter|couture|franglish)/gi).exec(title[i])) {
         //     switch((/(\bnodeschool|angular|phpschool|dessiner|english|language|chanter|couture|franglish)/gi).exec(title[i])[0].toLowerCase()) {
         //         case "angular":
         //             type1 = "Technologie";
         //             type2 = "Coder";
         //             image = "angular.png";
         //             console.log('ang');
         //             break;
         //         case "nodeschool":
         //             type1 = "Technologie";
         //             type2 = "Coder";
         //             image = "nodeschool.png";
         //             break;
         //         case "dessiner":
         //             type1 = "Art";
         //             type2 = "Dessiner";
         //             image = "meetupDessin.jpeg";
         //             console.log("dess")
         //             break;
         //         case "phpschool":
         //             type1 = "Technologie";
         //             type2 = "Coder";
         //             image = "phpschool.png";
         //             console.log("php")
         //             break;
         //         case "english":
         //             type1 = "Langage";
         //             type2 = "Anglais";
         //             image = "english.png";
         //             break;
         //         case "couture":
         //             type1 = "Artisanat";
         //             type2 = "Couture";
         //             image = "couture.png";
         //             break;
         //         case "franglish":
         //             type1 = "Langage";
         //             type2 = "English";
         //             image = "franglish.png";
         //             break;
         //         default:
         //             if ((/(italian|cooking|choeur)/gi).exec(url[i])) {
         //                 switch((/(italian|cooking|choeur)/gi).exec(url[i])[0].toLowerCase()) {
         //                     case "italien" :
         //                         type1 = "Cuisine";
         //                         type2 = "Italien";
         //                         image = "cuisineItalienne.png";
         //                         break;
         //                     case "cuisine" :
         //                         type1 = "Cuisine";
         //                         type2 = "Inconnu";
         //                         image = "Cuisine.png";
         //                         break;
         //                     case "choeur" :
         //                         type1 = "Art";
         //                         type2 = "Musique";
         //                         image = "musique.png";
         //                         break;
         //                     default:
         //                         break;
         //                 }
         //             }
         //             break;
         //     }
             if(type1 !== undefined && type2 !== undefined && type1 !== "" && type2 !== "") {
                 title[i] = title[i].replace(/\&shy;/g, "");
                 title[i] = title[i].replace(/\&#039;/g, "\'");
                 if (uniqueDates.indexOf(dates[i]) === -1 && dates[i] > currentDate) {
                     uniqueDates.push(dates[i]);
                 }
                 newEvents = pushEvents(newEvents, type1, type2, title[i], fullDate[i], url[i], time[i], image);
             }
         }
     }
     uniqueDates.sort();
     for (i = 0; i < uniqueDates.length; i++) {
         events.push({
           "date" : uniqueDates[i],
           "events": []
         });
     }
     for (var j = 0; j < events.length; j++) {
        for (i = 0; i < newEvents.length; i++) {
         if(newEvents[i].fulldate === events[j].date ) {
           events[j].events.push(newEvents[i]);
         }
       }
     }
     writeToJson(events);
 }
//000000000000000000000000000000000

 function createBody() {
     var bodys = "";
     for (var i=0 ; i < meetupUrls.length; i++) {
         request(meetupUrls[i], function(error, response, body) {
                 if (body) {
                     bodys += body;
                     if (i = meetupUrls.length+1) createJson(bodys);
                 }
         });
     }
 }
createBody();

 function writeToJson(file) {
   fs.writeFile(fileName, JSON.stringify(file), function (err) {
     if (err) return console.log(err);
   });
 }
