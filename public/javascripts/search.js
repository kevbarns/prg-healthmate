// require("dotenv").config();

const searchClient = algoliasearch(
  "M1MTK2G03G",
  "9d44f10b8a4bf86df51d8671c05505d5"
);

const search = instantsearch({
  indexName: "search_data",
  searchClient
});

search.addWidget(
  instantsearch.widgets.searchBox({
    container: "#searchbox"
  })
);

search.addWidget(
  instantsearch.widgets.hits({
    container: "#hits",
    templates: {
      item: `
      
      <div  style="flex-wrap: wrap !important;">
      <div >
      <div >
        <div>
          <figure class="image">
            <img src=" {{image}} " alt="" />
          </figure>
        </div>
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <p class="is-size-6"> <a href="/oneRecipe/{{_id}}">{{title}}</a> </p>
              <p class="is-size-7"> {{dishType}} </p>

          </div>
        </div>
        <div class="card-content">
          <div class="columns" style="display: flex;align-items: baseline;">
            <div class="column">
              <span class="icon is-large">
                <i class="fas fa-stopwatch fa-2x"></i>
              </span>
              <p class="is-size-5 has-text-centered"> {{cookingTime}} min. </p>
            </div>
            <div class="column">
              <span class="icon is-large">
                <i class="fas fa-hourglass-half fa-2x"></i>
              </span>
              <p class="is-size-5 has-text-centered"> {{prepTime}} min. </p>
            </div>
            <div class="column">
              <p class="is-size-4 has-text-centered"> {{kCal}} kCal </p>
            </div>
          </div>


        </div>
        <footer class="card-footer">
          <p class="card-footer-item has-background-primary"> P{{protein}} </p>
          <p class="card-footer-item has-background-warning"> C{{carbs}} </p>
          <p class="card-footer-item has-background-light"> L{{lipid}} </p>
        </footer>
      </div>
    </div>
    </div>
    
      `
    }
  })
);

search.start();
