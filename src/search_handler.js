function handleSearchRequest(user, query, featureFlagEnabled) {

    if (!featureFlagEnabled) {
        enableNewSearch();
    }

    return processSearch(query);
}


function enableNewSearch() {

    console.log("New search experience enabled");

}
