ebsa-portal
============

[![Dependency Status](https://david-dm.org/scbd/ebsa-portal.svg)](https://david-dm.org/scbd/ebsa-portal)

Ecologically or Biologically Significant Marine Areas (EBSAs) Portal

#####Dev Instructions:
1. Clone repo
2. `npm install` followed by `bower install`
3. `grunt serve` to start dev server with livereload, watch files and compass
auto-compile.
4. `grunt karma` to start a Karma server and run all tests
5. `grunt prot` to start protractor and run e2e tests.


####Search Index:
The website uses [lunr.js](lunrjs.com) to power a simple but flexible
text search implementation. All code is under project_folder/siteSearch.

Run `grunt index` to generate a fresh search index. This is required every
time the about or resources page markup changes.

######Technical description
The indexer works in a few simple stages:

1. The main indexer files patches in views.js and textNodeProcessor.js
2. views.js loads all necessary view files and returns their contents
as a map of {filename: fileContents}.
3. The map is passed over to textNodeProcessor which loads each fileContent
as markup into jsdom, and then uses node-jQuery and native DOM methods to extract
all text and compute a XPATH style CSS selector for each usable node (The processor
tries hard to make sure the selector is unique. It also computes a tab location
if the element is located inside a tab.
4. Once all the nodes are processed, the resulting array of documents is written to
data/lunr-documents.json for later use by siteSearch.js, and finally fed to lunr for
indexing. The resulting Lunr index is serialized and written to data/lunr-index.json.
5. When a search request comes in, siteSearch will load both the documents and lunr
index to treat the request. The query will be fed to Lunr which will return an array
of documents IDs and relevancy scores. The documents array is filtered by the IDs and
sorted by relevancy and finally returned to the search.html.js controller which will
render the results.
6. When a user clicks on a search match, highlighter.js will pick up the arguments and
highlight any matching node on the page that contains the match.

The structure for a parsed node is:
```javascript
{
  body: String - The .text() content of the node
  xpath: String - the encodeURIComponent(xpath) CSS selector for the element
  tabName: String - The .text() content of the tab if there is one,
  tabHash: String - The tab's hash link if there is one ex: #criteria,
  pageName: String - The name of the page the element belongs to.
}
```
