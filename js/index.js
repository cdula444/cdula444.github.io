document.addEventListener("DOMContentLoaded", function() {

    let paintingsDis = document.querySelector("div.paintings");
    let galDis = document.querySelector("div.gal-list");
    let infoDis = document.querySelector("div.gal-info");
    let mapDis = document.querySelector("div.map");
    let lPaintDis = document.querySelector("div.largerPainting");
    let button = document.querySelector("#closeButton");
    const galList = document.querySelector("div.gal-list section");
    let gList = document.querySelector("#galleryList");
    let paintingsSrc = document.querySelector("#imgPaintings");
    let table = document.querySelector("tbody");
    let largeImgSrc = document.querySelector("#imageLarge");
    let button2 = document.querySelector("#toggleOn");


    infoDis.style.display = 'none';
    mapDis.style.display = 'none';
    paintingsDis.style.display = 'none';
    lPaintDis.style.display = 'none';
    button2.style.display = "none";


    const galleries = 'https://www.randyconnolly.com/funwebdev/3rd/api/art/galleries.php';


    fetch(galleries)
        .then((resp) => resp.json())
        .then(data => { getGalData(data) })
        .catch(error => console.error(error));

    function getGalData(gal) {
        document.querySelector("#loader1").classList.remove("lds-ellipsis");
        document.querySelector("#loader2").classList.remove("lds-ellipsis");
        galList.style.display = "block";
        infoDis.style.display = 'none';
        mapDis.style.display = 'none';
        paintingsDis.style.display = 'none';
        lPaintDis.style.display = 'none';


        for (let i of gal) {
            let newLi = document.createElement("li");
            newLi.textContent = i.GalleryName;
            newLi.setAttribute("id", i.GalleryID);
            gList.appendChild(newLi);
        }


        galList.onclick = function(event) {

            let target = event.target;
            if (target.nodeName != "LI") {
                return;

            } else {
                let targetID = target.getAttribute("id");
                galList.style.display = "block";
                infoDis.style.display = 'block';
                mapDis.style.display = 'block';
                paintingsDis.style.display = 'block';
                lPaintDis.style.display = 'none';
                displayGalleryInfo(target.textContent, gal);
                initMap(target.textContent, gal);
                document.querySelector("#loader2").classList.add("lds-ellipsis");
                displayPaintings(targetID);

            }
        }

        document.querySelector("#toggleOff").addEventListener('click', function() {
            galDis.style.display = "none";
            button2.style.display = "block";
        });

        document.querySelector("#toggleOn").addEventListener('click', function() {
            galDis.style.display = "block";
            button2.style.display = "none";
        });
    }

    function displayGalleryInfo(n, l) {
        const h2 = document.querySelector("#galleryName");
        const native = document.querySelector("#galleryNative");
        const city = document.querySelector("#galleryCity");
        const address = document.querySelector("#galleryAddress");
        const country = document.querySelector("#galleryCountry");
        const home = document.querySelector("#galleryWebSite");

        let galName = n;
        h2.textContent = galName;
        native.textContent = galName;

        for (let a of l) {
            if (n == a.GalleryName) {
                city.textContent = a.GalleryCity;
                address.textContent = a.GalleryAddress;
                country.textContent = a.GalleryCountry;
                home.textContent = a.GalleryWebSite;
                home.setAttribute("href", a.GalleryWebSite);
            }

        }
    }

    var map;

    function initMap(tgt, g) {
        for (let m of g) {
            if (tgt == m.GalleryName) {
                let mLat = m.Latitude;
                let mLng = m.Longitude;
                map = new google.maps.Map(document.querySelector("div.map"), {
                    center: { lat: mLat, lng: mLng },
                    mapTypeId: 'satellite',
                    zoom: 18
                });
                map.setTilt(45);
            }
        }
    }

    function displayPaintings(tID) {
        let galleriesInfo = 'https://www.randyconnolly.com/funwebdev/3rd/api/art/paintings.php?gallery=' + tID;
        let imageSrc = 'https://res.cloudinary.com/funwebdev/image/upload/w_150/art/paintings/';


        fetch(galleriesInfo)
            .then((resp) => resp.json())
            .then(data => {
                document.querySelector("#loader2").classList.remove("lds-ellipsis");

                sortByName(data);
                paintingsSrc.textContent = "";
                for (let d of data) {



                    let firstRow = document.createElement("tr");
                    let firstElement = document.createElement("td");

                    let newImg = document.createElement("img");
                    newImg.setAttribute("src", imageSrc + d.ImageFileName);
                    newImg.setAttribute("class", "imageClass");

                    firstElement.appendChild(newImg);
                    firstRow.appendChild(firstElement);
                    paintingsSrc.appendChild(firstRow);

                    let secondElement = document.createElement("td");
                    secondElement.textContent = d.LastName;
                    firstRow.appendChild(secondElement);

                    let thirdElement = document.createElement("td");
                    thirdElement.textContent = d.Title;
                    firstRow.appendChild(thirdElement);

                    let fourthElement = document.createElement("td");
                    fourthElement.textContent = d.YearOfWork;
                    firstRow.appendChild(fourthElement);


                }
                clickPaintings(tID);
            })

        .catch(error => console.error(error));
    }

    /* 
        function clickSort(da) {
            let table = document.querySelector("table");

            table.onclick = function(event) {
                let target = event.target;
                if (target.nodeName != "TH" || target.innerHTML == "") {
                    return;
                } else {
                    if (target.textContent == "Artist") {

                        sortByName(data);
                        displayPaintings(data);
                        console.log(data);


                    } else if (target.textContent == "Title") {
                        sortByTitle(data);
                        displayPaintings(data);
                        console.log(data);


                    } else if (target.textContent == "Year") {
                        sortByYear(data);
                        displayPaintings(data);
                        console.log(data);



                    } else {
                        return;
                    }
                }
            }

        } */

    function sortByYear(d1) {


        d1.sort((a, b) => {

            return a.Year < b.Year ? -1 : 1;
        });


    }

    function sortByTitle(d2) {

        d2.sort((a, b) => {
            a = a.Title.toLowerCase();
            b = b.Title.toLowerCase();
            return a < b ? -1 : 1;
        });


    }

    function sortByName(d3) {


        d3.sort((a, b) => {
            a = a.LastName.toLowerCase();
            b = b.LastName.toLowerCase();
            return a < b ? -1 : 1;
        });


    }

    function clickPaintings(id) {

        let galInfo = 'https://www.randyconnolly.com/funwebdev/3rd/api/art/paintings.php?gallery=' + id;
        let imgS = 'https://res.cloudinary.com/funwebdev/image/upload/w_150/art/paintings/';


        fetch(galInfo)
            .then((resp) => resp.json())
            .then(data => {


                table.onclick = function(event) {


                    paintingsDis.style.display = "none";
                    galDis.style.display = "none";
                    infoDis.style.display = "none";
                    mapDis.style.display = "none";
                    lPaintDis.style.display = "block";
                    let target = event.target;
                    let attr = target.getAttribute("src");
                    let filename = attr.split("/").pop();
                    if (target.nodeName != "IMG") {
                        return;
                    } else {
                        let largeImg = document.createElement("img");
                        largeImg.setAttribute("src", imgS + filename);
                        largeImg.setAttribute("style", "width:300px");
                        largeImgSrc.appendChild(largeImg);

                        for (let y of data) {
                            if (filename == y.ImageFileName) {
                                let paintingTitle = document.querySelector("#paintTitle");
                                let artistNm = document.querySelector("#artistName");
                                let yearO = document.querySelector("#yOW");
                                let gNm = document.querySelector("#gName");
                                let gCty = document.querySelector("#gCity");
                                let muLink = document.querySelector("#mLink");
                                let cRight = document.querySelector("#copyright");
                                let widthSize = document.querySelector("#width");
                                let heightSize = document.querySelector("#height");
                                let med = document.querySelector("#medium");
                                let descrip = document.querySelector("#desc");


                                paintingTitle.textContent = y.Title;
                                artistNm.textContent = `${y.FirstName} ${y.LastName}`;
                                yearO.textContent = y.YearOfWork;
                                gNm.textContent = y.GalleryName;
                                gCty.textContent = y.GalleryCity;
                                muLink.textContent = y.MuseumLink;
                                muLink.setAttribute("href", y.MuseumLink);
                                cRight.textContent = y.CopyrightText;
                                widthSize.textContent = y.Width;
                                heightSize.textContent = y.Height;
                                med.textContent = y.Medium;
                                descrip.textContent = y.Description;


                                // Line 289-307. Sourced from https://www.w3schools.com/howto/howto_css_modals.asp
                                let modal = document.querySelector("#myModal");
                                // Get the image and insert it inside the modal
                                let modalImg = document.querySelector("#img01");
                                largeImgSrc.onclick = function() {
                                    modal.style.display = "block";
                                    modalImg.src = imgS + filename;
                                }

                                // Get the <span> element that closes the modal
                                let span1 = document.querySelector("span.close");

                                // When the user clicks on <span> (x), close the modal
                                span1.onclick = function() {
                                    modal.style.display = "none";
                                }

                                window.onclick = function(event) {
                                    if (event.target == modal) {
                                        modal.style.display = "none";
                                    }
                                }
                            }


                        }
                    }
                }
                largeImgSrc.textContent = "";

                button.addEventListener('click', function(e) {

                    if (e.target) {
                        paintingsDis.style.display = "block";
                        galDis.style.display = "block";
                        infoDis.style.display = "block";
                        mapDis.style.display = "block";
                        lPaintDis.style.display = "none";

                    }
                    largeImgSrc.textContent = "";
                });
            });
        largeImgSrc.style.visibility = "visible";
    }

});

/* Colours and Sorting does not work! Tried to implement it, but I never got it to function properly */
