import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers';


/*
	Prologue by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$nav = $('#nav');

	// Breakpoints.
		breakpoints({
			wide:      [ '961px',  '1880px' ],
			normal:    [ '961px',  '1620px' ],
			narrow:    [ '961px',  '1320px' ],
			narrower:  [ '737px',  '960px'  ],
			mobile:    [ null,     '736px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Nav.
		var $nav_a = $nav.find('a');

		$nav_a
			.addClass('scrolly')
			.on('click', function(e) {

				var $this = $(this);

				// External link? Bail.
					if ($this.attr('href').charAt(0) != '#')
						return;

				// Prevent default.
					e.preventDefault();

				// Deactivate all links.
					$nav_a.removeClass('active');

				// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
					$this
						.addClass('active')
						.addClass('active-locked');

			})
			.each(function() {

				var	$this = $(this),
					id = $this.attr('href'),
					$section = $(id);

				// No section for this link? Bail.
					if ($section.length < 1)
						return;

				// Scrollex.
					$section.scrollex({
						mode: 'middle',
						top: '-10vh',
						bottom: '-10vh',
						initialize: function() {

							// Deactivate section.
								$section.addClass('inactive');

						},
						enter: function() {

							// Activate section.
								$section.removeClass('inactive');

							// No locked links? Deactivate all links and activate this section's one.
								if ($nav_a.filter('.active-locked').length == 0) {

									$nav_a.removeClass('active');
									$this.addClass('active');

								}

							// Otherwise, if this section's link is the one that's locked, unlock it.
								else if ($this.hasClass('active-locked'))
									$this.removeClass('active-locked');

						}
					});

			});

	// Scrolly.
		$('.scrolly').scrolly();

	// Header (narrower + mobile).

		// Toggle.
			$(
				'<div id="headerToggle">' +
					'<a href="#header" class="toggle"></a>' +
				'</div>'
			)
				.appendTo($body);

		// Header.
			$('#header')
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
					visibleClass: 'header-visible'
				});

})(jQuery);

let sdgs 

// Function to clear the table
function clearTable() {
    var tableBody = document.getElementById("results-table").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = ''; // Clear the content of the tbody
}

// Function to append entries in descending score order
function appendEntriesInDescendingOrder() {
    const tableBody = document.getElementById("results-table").getElementsByTagName("tbody")[0];

    // Sort sdgs array by "score" property in descending order
    sdgs.sort((a, b) => b.score - a.score);

    // Loop through the sorted sdgs array and append rows to the table
    sdgs.forEach(function (item) {
        var row = tableBody.insertRow(-1);

        // Add cells to the row based on the order of the table header
        var sdgNumberWithLeadingZeros = ('00' + item.SDGNumber).slice(-2);
        row.insertCell(0).innerHTML = '<td><img class="sdg-icon" src="images/E-WEB-Goal-' + sdgNumberWithLeadingZeros + '.png" alt="SDG ' + item.SDGNumber + '"></td>';
        row.insertCell(1).innerHTML = '<td>' + item.SDGNumber + '</td>';
        row.insertCell(2).innerHTML = '<td>' + item.SDGTitle + '</td>';
        row.insertCell(3).innerHTML = '<td>' + item.TargetsNumber + '</td>';
        row.insertCell(4).innerHTML = '<td>' + item.Targets + '</td>';
        //row.insertCell(5).innerHTML = '<td>' + item.IndicatorsNumber + '</td>';
        //row.insertCell(6).innerHTML = '<td>' + item.Indicators + '</td>';
        //row.insertCell(7).innerHTML = '<td>' + item.UNSDIndicatorCodes + '</td>';
        row.insertCell(5).innerHTML = '<td>' + item.score + '</td>';
    });
}




const sortOrder = { columnIndex: null, ascending: true };

const parseCellValue = (value) => {
  if (!isNaN(value)) {
    return parseFloat(value);
  }

  const parts = value.split('.').map(part => {
    const num = parseInt(part, 10);
    return isNaN(num) ? part : num;
  });

  return parts;
};

const compareValues = (x, y) => {
  if (Array.isArray(x) && Array.isArray(y)) {
    for (let i = 0; i < Math.min(x.length, y.length); i++) {
      if (x[i] !== y[i]) {
        return x[i] < y[i] ? -1 : 1;
      }
    }
    return x.length - y.length;
  }

  return x < y ? -1 : (x > y ? 1 : 0);
};

const clearSortOrder = () => {
  const table = document.getElementById("results-table");
  const headers = Array.from(table.querySelectorAll('th[data-index]'));

  headers.forEach((header) => {
    const icon = header.querySelector('.sort-icon');
    icon.classList.remove('up', 'down');
  });
};

const sortTable = (columnIndex) => {
  const table = document.getElementById("results-table");
  const headers = Array.from(table.querySelectorAll('th[data-index]'));
  const rows = Array.from(table.rows).slice(1); // Skip header row

  if (sortOrder.columnIndex !== columnIndex) {
    sortOrder.ascending = true;
    clearSortOrder();
  }

  sortOrder.columnIndex = columnIndex;
  sortOrder.ascending = !sortOrder.ascending;

  headers.forEach((header, index) => {
    const icon = header.querySelector('.sort-icon');
    if (index === columnIndex) {
      icon.classList.toggle('up', sortOrder.ascending);
      icon.classList.toggle('down', !sortOrder.ascending);
    }
  });

  rows.sort((a, b) => {
    //console.log(a,b)
    const x = parseCellValue(a.cells[columnIndex].textContent);
    const y = parseCellValue(b.cells[columnIndex].textContent);

    const multiplier = sortOrder.ascending ? 1 : -1;

    return multiplier * compareValues(x, y);
  });

  rows.forEach(row => table.tBodies[0].appendChild(row));
};

// Add event listeners to each th element
const thElements = document.querySelectorAll('th[data-index]');
thElements.forEach(th => {
  th.addEventListener('click', () => {
    const columnIndex = parseInt(th.getAttribute('data-index'), 10);
    sortTable(columnIndex);
  });
});




  function fetchUnzip(url){
    fetch(url=url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.arrayBuffer(); // Get the response as an ArrayBuffer
        })
        .then((gzippedData) => {
            // Decompress the gzipped data using pako
            console.log("file loaded, start decompression");
            const jsonString = pako.inflate(new Uint8Array(gzippedData), { to: 'string' });

            // Parse the JSON string into an object
            const jsonObject = JSON.parse(jsonString);

            // Callback with the extracted JSON object
            console.log("file decompressed");
			//console.log(jsonObject)
            sdgs = jsonObject
            
			
// Get the table body element
var tableBody = document.getElementById("results-table").getElementsByTagName("tbody")[0];

// Loop through the JSON data and append rows to the table
sdgs.forEach(function(item) {
    // Create a new row
    var row = tableBody.insertRow(-1);

    // Add cells to the row based on the order of the table header
    // Note: Adjust the cell index based on the order of your thead columns
    var sdgNumberWithLeadingZeros = ('00' + item.SDGNumber).slice(-2); // Add leading zeros
    row.insertCell(0).innerHTML = '<td><img class="sdg-icon" src="images/E-WEB-Goal-' + sdgNumberWithLeadingZeros + '.png" alt="SDG ' + item.SDGNumber + '"></td>';

	row.insertCell(1).innerHTML = '<td>' + item.SDGNumber + '</td>';
    row.insertCell(2).innerHTML = '<td>' + item.SDGTitle + '</td>';
    row.insertCell(3).innerHTML = '<td>' + item.TargetsNumber + '</td>';
    row.insertCell(4).innerHTML = '<td>' + item.Targets + '</td>';
    //row.insertCell(5).innerHTML = '<td>' + item.IndicatorsNumber + '</td>';
    //row.insertCell(6).innerHTML = '<td>' + item.Indicators + '</td>';
    //row.insertCell(7).innerHTML = '<td>' + item.UNSDIndicatorCodes + '</td>';
	  row.insertCell(5).innerHTML = '<td>' + 0 + '</td>';
    // Assuming you have a score property in your JSON data, adjust accordingly
    //row.insertCell(7).innerHTML = '<td>' + (item["jina-embeddings-v2-base-en"] ? item["jina-embeddings-v2-base-en"].join(", ") : "") + '</td>';
});



        })
        .catch((error) => {
            console.error('Error loading or extracting JSON.gz:', error);
        });
}

fetchUnzip("assets/SDG_Target_2023_jina_base.json.gz")


let pipe
async function allocatePipeline() {
  pipe = await pipeline("embeddings", "Xenova/jina-embeddings-v2-base-en");
  var button = document.getElementById("query_button");
  button.disabled = false;
  button.innerHTML  = "Query";
}
allocatePipeline();

function updateCosineSimilarity(queryEmbedding, sdgArray) {
  console.time("updateCosineSimilarity");
  const EMBED_DIM = queryEmbedding.length;

  // Calculate the norm of the query embedding
  const normEmbeds = Math.sqrt(queryEmbedding.reduce((acc, val) => acc + val * val, 0));

  // Precalculate the norms of the database vectors
  sdgArray.forEach((sdg) => {
      const dbVector = sdg["jina-embeddings-v2-base-en"];
      const normDB = dbVector.reduce((acc, val) => acc + val * val, 0);

      // Check if the query embedding and database vector have changed
      if (sdg["queryEmbedding"] !== queryEmbedding || sdg["dbVector"] !== dbVector) {
          let dotProduct = 0;

          for (let i = 0; i < EMBED_DIM; ++i) {
              const embedValue = queryEmbedding[i];
              const dbValue = dbVector[i];
              dotProduct += embedValue * dbValue;
          }

          // Update the similarity score only if it has changed
          const newSimilarityScore = dotProduct / (normEmbeds * Math.sqrt(normDB));
          if (sdg["score"] !== newSimilarityScore) {
              sdg["score"] = newSimilarityScore.toFixed(2);
          }

          // Update the stored query embedding and database vector
          sdg["queryEmbedding"] = queryEmbedding;
          sdg["dbVector"] = dbVector;
      }
  });
  console.timeEnd("updateCosineSimilarity");
}


document.addEventListener('DOMContentLoaded', () => {
	const toggleButton = document.getElementById('toggleButton');
	let isHidden = false;

	toggleButton.addEventListener('click', () => {
	  toggleEntries();
	});

	function toggleEntries() {
	  const table = document.getElementById("results-table");
	  const tbody = table.getElementsByTagName("tbody")[0];
	  const rows = tbody.getElementsByTagName("tr");

	  // Toggle the visibility state
	  isHidden = !isHidden;

	  // Loop through all rows and hide/show based on the toggle condition
	  for (let i = 0; i < rows.length; i++) {
		if (i >= 10 && isHidden) {
		  // If index is greater than or equal to 10 and rows are currently hidden, hide the row
		  rows[i].style.display = "none";
		} else {
		  // Otherwise, show the row
		  rows[i].style.display = "";
		}
	  }
	}
  });


  const colorArray = ["#E5243B","#DDA63A","#4C9F38","#C5192D","#FF3A21","#26BDE2","#FCC30B","#A21942","#FD6925","#DD1367","#FD9D24","#BF8B2E","#3F7E44","#0A97D9","#56C02B","#00689D","#19486A"]

  const SDGTitles = 
  {
    "1": "No Poverty",
    "2": "Zero Hunger",
    "3": "Good Health and Well-being",
    "4": "Quality Education",
    "5": "Gender Equality",
    "6": "Clean Water and Sanitation",
    "7": "Affordable and Clean Energy",
    "8": "Decent Work and Economic Growth",
    "9": "Industry, Innovation, and Infrastructure",
    "10": "Reduced Inequality",
    "11": "Sustainable Cities and Communities",
    "12": "Responsible Consumption and Production",
    "13": "Climate Action",
    "14": "Life Below Water",
    "15": "Life on Land",
    "16": "Peace, Justice, and Strong Institutions",
    "17": "Partnerships for the Goals"
  }
  
      // Get the chart-container element
      var chartContainer = document.getElementById('chart-container');


  async function get_embedding(message) {
    console.time("get_embedding");

    $("#spinner_overlay").css("display", "flex");

    // Delay the execution of pipe by 0 milliseconds
    await new Promise(resolve => setTimeout(resolve, 20));

    try {
        let out = await pipe(message, { pooling: 'mean', normalize: false });
        updateCosineSimilarity(out.data, sdgs);
    } finally {
        $("#spinner_overlay").css("display", "none");
        console.log(sdgs);


    // Create an h3 element
    var h3Title = document.createElement('h3');

    var words = message.split(' ');
    var limitedText = words.slice(0, 30).join(' ');

    if (words.length > 30) {
        limitedText += '...';
    }

    h3Title.textContent = limitedText;

    // Append the h3 element to the chart-container
    chartContainer.appendChild(h3Title);

// Set up chart dimensions
var margin = { top: 20, right: 20, bottom: 200, left: 40 };
var containerWidth = document.getElementById('chart-container').clientWidth;
var width = containerWidth - margin.left - margin.right;
var height = 300;

// Create SVG container
var svg = d3.select("#chart-container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Compute the maximum score for each SDGNumber
var maxScores = d3.nest()
  .key(function(d) { return d.SDGNumber; })
  .rollup(function(values) { return d3.max(values, function(d) { return d.score; }); })
  .entries(sdgs).sort(function(a, b) {
    return a.key - b.key;
  });

  console.log(maxScores)
// X-axis scale
var x = d3.scaleBand()
  .domain(maxScores.map(function(d) { return d.key; }))
  .range([0, width])
  .padding(0.1);

// Y-axis scale
var y = d3.scaleLinear()
  .domain([d3.min(maxScores, function(d) { return d.value; }), d3.max(maxScores, function(d) { return d.value; })])
  .range([height, 0]);

// Create bars
svg.selectAll(".bar")
  .data(maxScores)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("x", function(d) { return x(d.key); })
  .attr("width", x.bandwidth())
  .attr("y", function(d) { return y(d.value); })
  .attr("height", function(d) { return height - y(d.value); })
  .attr("fill", function(d, i) { return colorArray[i]; })
  .on("mouseover", function(d) {
    // Show tooltip on mouseover
    tooltip.html("SDG " + d.key + " ( " + SDGTitles[d.key] +"): " + d.value  )
      .style("left", d3.event.pageX + "px")
      .style("top", d3.event.pageY - 28 + "px")
      .style("display", "block");
  })
  .on("mouseout", function(d) {
    // Hide tooltip on mouseout
    tooltip.style("display", "none");
  });

svg.selectAll(".sdg-image")
  .data(maxScores)
  .enter().append("image")
  .attr("class", "sdg-image")
  .attr("x", function(d) { return x(d.key); })
  .attr("y", height + margin.top)  // Adjust the y position as needed
  .attr("width", x.bandwidth())
  .attr("height", x.bandwidth())  // Adjust the height as needed
  .attr("xlink:href", function(d) {
    var sdgNumberWithLeadingZeros = ('00' + d.key).slice(-2);
    return "images/E-WEB-Goal-" + sdgNumberWithLeadingZeros + ".png";
  })
  .on("mouseover", function(d) {
    // Show tooltip on mouseover
    tooltip.html("SDG " + d.key + " ( " + SDGTitles[d.key] +"): " + d.value  )
      .style("left", d3.event.pageX + "px")
      .style("top", d3.event.pageY - 28 + "px")
      .style("display", "block");
  })
  .on("mouseout", function(d) {
    // Hide tooltip on mouseout
    tooltip.style("display", "none");
  });

// Create a tooltip div
var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("display", "none");

// Add X-axis
svg.append("g")
  .attr("class", "x-axis")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// Add Y-axis
svg.append("g")
  .call(d3.axisLeft(y));

// Redraw chart on window resize
function redrawChart() {
  // Update the container width
  var containerWidth = document.getElementById('chart-container').clientWidth;

  // Update chart dimensions
  width = containerWidth - margin.left - margin.right;

  // Update X-axis scale
  x.range([0, width]);

  // Update SVG container width
  svg.attr("width", width + margin.left + margin.right);

  // Update bars
  svg.selectAll(".bar")
    .attr("x", function(d) { return x(d.key); })
    .attr("width", x.bandwidth());

  // Update SDG images
  svg.selectAll(".sdg-image")
    .attr("x", function(d) { return x(d.key); })
    .attr("width", x.bandwidth());

  // Update X-axis
  svg.select(".x-axis")
    .call(d3.axisBottom(x));
}


// Initial chart setup
redrawChart();

// Redraw chart on window resize
window.addEventListener('resize', redrawChart);


    }
    console.timeEnd("get_embedding");
}


  async function update_table(){
    // Log the text from the textarea
    var messageText = document.querySelector('textarea[name="message"]').value;
    //console.log(messageText);
    await get_embedding(messageText);
  
    // Clear the table
    clearTable();

    // Append entries in descending score order
    appendEntriesInDescendingOrder();
    $("#spinner_overlay").css("display","none");
}

$(document).ready(() => {
    $('#buttonA').on('click', (event) => {
        event.preventDefault();
        const this_text = `South Africa's parliament has passed a major education bill that could see parents face prison if their children are not in school.`
        updateTextarea(this_text);
        update_table();
    });

    $('#buttonB').on('click', (event) => {
        event.preventDefault();
        const this_text = `Near a great forest there lived a poor woodcutter and his wife, and his two children; the boy's name was Hansel and the girl's Grethel. They had very little to bite or to sup, and once, when there was great dearth in the land, the man could not even gain the daily bread. As he lay in bed one night thinking of this, and turning and tossing, he sighed heavily, and said to his wife, "What will become of us? we cannot even feed our children; there is nothing left for ourselves."
        "I will tell you what, husband," answered the wife; "we will take the children early in the morning into the forest, where it is thickest; we will make them a fire, and we will give each of them a piece of bread, then we will go to our work and leave them alone; they will never find the way home again, and we shall be quit of them."
        "No, wife," said the man, "I cannot do that; I cannot find in my heart to take my children into the forest and to leave them there alone; the wild animals would soon come and devour them." - "O you fool," said she, "then we will all four starve; you had better get the coffins ready," and she left him no peace until he consented. "But I really pity the poor children," said the man.
        The two children had not been able to sleep for hunger, and had heard what their step-mother had said to their father. Grethel wept bitterly, and said to Hansel, "It is all over with us."
        "Do be quiet, Grethel," said Hansel, "and do not fret; 1 will manage something." And when the parents had gone to sleep he got up, put on his little coat, opened the back door, and slipped out. The moon was shining brightly, and the white flints that lay in front of the house glistened like pieces of silver. Hansel stooped and filled the little pocket of his coat as full as it would hold. Then he went back again, and said to Grethel, "Be easy, dear little sister, and go to sleep quietly; God will not forsake us," and laid himself down again in his bed. When the day was breaking, and before the sun had risen, the wife came and awakened the two children, saying, "Get up, you lazy bones; we are going into the forest to cut wood." Then she gave each of them a piece of bread, and said, "That is for dinner, and you must not eat it before then, for you will get no more." Grethel carried the bread under her apron, for Hansel had his pockets full of the flints. Then they set off all together on their way to the forest. When they had gone a little way Hansel stood still and looked back towards the house, and this he did again and again, till his father said to him, "Hansel, what are you looking at? take care not to forget your legs."
        "O father," said Hansel, "lam looking at my little white kitten, who is sitting up on the roof to bid me good-bye." - "You young fool," said the woman, "that is not your kitten, but the sunshine on the chimney-pot." Of course Hansel had not been looking at his kitten, but had been taking every now and then a flint from his pocket and dropping it on the road. When they reached the middle of the forest the father told the children to collect wood to make a fire to keep them, warm; and Hansel and Grethel gathered brushwood enough for a little mountain; and it was set on fire, and when the flame was burning quite high the wife said, "Now lie down by the fire and rest yourselves, you children, and we will go and cut wood; and when we are ready we will come and fetch you."
        So Hansel and Grethel sat by the fire, and at noon they each ate their pieces of bread. They thought their father was in the wood all the time, as they seemed to hear the strokes of the axe: but really it was only a dry branch hanging to a withered tree that the wind moved to and fro. So when they had stayed there a long time their eyelids closed with weariness, and they fell fast asleep.
        When at last they woke it was night, and Grethel began to cry, and said, "How shall we ever get out of this wood? "But Hansel comforted her, saying, "Wait a little while longer, until the moon rises, and then we can easily find the way home." And when the full moon got up Hansel took his little sister by the hand, and followed the way where the flint stones shone like silver, and showed them the road. They walked on the whole night through, and at the break of day they came to their father's house. They knocked at the door, and when the wife opened it and saw that it was Hansel and Grethel she said, "You naughty children, why did you sleep so long in the wood? we thought you were never coming home again!" But the father was glad, for it had gone to his heart to leave them both in the woods alone.
        Not very long after that there was again great scarcity in those parts, and the children heard their mother say at night in bed to their father, "Everything is finished up; we have only half a loaf, and after that the tale comes to an end. The children must be off; we will take them farther into the wood this time, so that they shall not be able to find the way back again; there is no other way to manage." The man felt sad at heart, and he thought, "It would better to share one's last morsel with one's children." But the wife would listen to nothing that he said, but scolded and reproached him. He who says A must say B too, and when a man has given in once he has to do it a second time.`
        updateTextarea(this_text);
        update_table();
    });

    $('#buttonC').on('click', (event) => {
      event.preventDefault();
      const this_text = `Erasmus+ is the EU's programme to support education, training, youth and sport in Europe. Launched in 1987, the "Erasmus" programme was originally established to promote closer cooperation between universities and higher education institutions across Europe. Over time, the programme has expanded and is now referred to as Erasmus+, or Erasmus Plus, combining the EU's different schemes for transnational cooperation and mobility in education, training, youth and sport in Europe and beyond. The 'Erasmus+' programme concluded its first funding cycle from 2014 to 2020 and is now in its second cycle, spanning from 2021 to 2027. Noted for its participation among staff, students, young people, and learners across age groups, as of 2021, the programme has engaged over 13 million participants. The origins of its name refers to Erasmus of Rotterdam a leading scholar and inspiring lecturer during the Renaissance period who travelled extensively in Europe to teach and study at a number of universities. But at the same time, the word “Erasmus” also served as the acronym for "EuRopean Community Action Scheme for the Mobility of University Students".
      In 1989, the Erasmus Bureau invited 32 former Erasmus students for an evaluation meeting in Ghent, Belgium. The lack of peer-to-peer support was singled out as a major issue, but it was also a driving force behind the creation of the Erasmus Student Network. The organization supports students from Erasmus programme and other bilateral agreement and cooperates with national agencies in order to help international students. As of 23 July 2020, the Erasmus Student Network consists of 534 local associations ("sections") in 42 countries and has more than 15,000 volunteers across Europe.
      As of 2014, 27 years after its creation, the programme has promoted the mobility of more than 3.3 million students within the European community. More than 5,000 higher education institutions from 38 countries are participating in the project.[1]
      The Erasmus Programme, together with a number of other independent programmes, was incorporated into the Socrates programme established by the European Commission in 1994. The Socrates programme ended on 31 December 1999 and was replaced with the Socrates II programme on 24 January 2000, which in turn was replaced by the Lifelong Learning Programme 2007–2013 on 1 January 2007.
      Beside the more popular student mobility (SMS), the Erasmus+ programme promotes the teacher mobility (STA), by which university teachers can spend a short period, for a minimum of 2 teaching days and a maximum of 2 months, teaching at least 8 hours in a foreign partner university. The average and suggested stay is of 5 teaching days`
      updateTextarea(this_text);
      update_table();
  });

    const updateTextarea = (text) => {
        $('#query_text').val(text);
    };
});

document.querySelector('#query_button').addEventListener('click', async function (event) {
  event.preventDefault(); // Prevent the default form submission behavior
  update_table()

});