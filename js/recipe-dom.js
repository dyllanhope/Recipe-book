const categoryTemplateSource = document.querySelector('.categoryTemplate').innerHTML;
const recipeTemplateSource = document.querySelector('.recipeTemplate').innerHTML;
const mealTemplateSource = document.querySelector('.mealTemplate').innerHTML;
const mealRecipeTemplateSource = document.querySelector('.mealRecipeTemplate').innerHTML;

const categoryTemplate = Handlebars.compile(categoryTemplateSource);
const recipeTemplate = Handlebars.compile(recipeTemplateSource);
const mealTemplate = Handlebars.compile(mealTemplateSource);
const mealRecipeTemplate = Handlebars.compile(mealRecipeTemplateSource);

const pageData = document.querySelector('.pageData');
const mealData = document.querySelector('.mealData');

const categoryBtn = document.querySelector('.categories');
const recipeBtn = document.querySelector('.recipes');

const alert = document.querySelector('.alert');
const title = document.querySelector('.title');

window.onload = () => {
    alert.style.display = 'none';
};

recipeBtn.addEventListener('click', () => {
    mealData.innerHTML = '';
    title.style.marginTop = 0;
    let recHTML = recipeTemplate();
    pageData.innerHTML = recHTML;
    recipeSearchBtn = document.querySelector('.recipeSearch');
    recipeInput = document.querySelector('.recipeInput');
    recipeSearchBtn.addEventListener('click', () => {
        let recipe = recipeInput.value;
        buildSingleMeals(recipe);
    });
});

categoryBtn.addEventListener('click', () => {
    mealData.innerHTML = '';
    title.style.marginTop = 0;
    pullCategories();
});

const pullCategories = () => {
    axios
        .get('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then((res) => {
            let response = res.data;
            let categoryData = response.categories;
            let categoryList = [];
            for (let item of categoryData) {
                categoryList.push(item.strCategory);
            };
            let catHTML = categoryTemplate({ list: categoryList });
            pageData.innerHTML = catHTML;
        })
        .then(() => {
            const categoryDrop = document.querySelector('.catDrop');
            categoryDrop.onchange = () => {
                axios
                    .get('https://www.themealdb.com/api/json/v1/1/filter.php?c=' + categoryDrop.value)
                    .then((results) => {
                        let response = results.data;
                        let meals = response.meals;
                        buildMeals(meals);
                    });
            };
        });
};

const buildMeals = (meals) => {
    let data = { list: meals };
    let html = mealTemplate(data);
    mealData.innerHTML = html;
    mealList = document.querySelector('.mealList');
    mealList.onclick = () => {
        let meal = event.target.id;
        buildSingleMeals(meal);
    };
};

const buildSingleMeals = (meal) => {
    axios
        .get('https://www.themealdb.com/api/json/v1/1/search.php?s=' + meal)
        .then((res) => {
            let response = res.data;
            let data = response.meals;
            if (data) {
                let completeData = getIngredients(data);
                let options = { meals: completeData };
                let html = mealRecipeTemplate(options);
                mealData.innerHTML = html;
            } else {
                recipeInput.innerHTML = '';
                alert.style = '';
                alert.innerHTML = 'We do not have a recipe for ' + meal;
                setTimeout(()=>{
                    alert.style.display = 'none';
                }, 3000); 
            }
        });
}

const getIngredients = (mealData) => {
    let data = mealData
    for (let i = 0; i < data.length; i++) {
        let list = [];
        for (let x = 1; x <= 20; x++) {
            let str = 'strIngredient' + x;
            let msr = 'strMeasure' + x;
            let ingr = data[i][str];
            let measure = data[i][msr];
            if (ingr) {
                list.push(ingr + ' - ' + measure);
            };
        };
        data[i].ingredientList = list;
    };
    return data;
};

