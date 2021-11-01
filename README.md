# magic-store

This is a store designed to simplify API compunication. 

## How it works?

This module creates a new module for a vuex store. This module will contain an object with fields for each end-point, an action to fetch at a specific end-point and
a getter to access the data.

## How to use?

To get started call the `createStore()` method. This method can receive an object that contains custom actions, mutations and getters you may want to create.

### Example
```
createStore({
  getters: {
    customGetterExample: (state) => state.data
  }
  actions: {
    customActionExample: (actionObject, payload) => actionObject.commit('customMutationExample',payload)
  }
  mutations: {
    customMutationExample: (state, payload) => state.data = payload
  }
})
```

To define a fetch on a route call one of the following methods: 
```
addGetRoute({resourceName: String, initialValue: any, endPoint: String, serializer: Function, customActions: Array[String], customMutaions: Array[String]}) 
addDeleteRoute({resourceName: String, initialValue: any, endPoint: String, serializer: Function, customActions: Array[String], customMutaions: Array[String]}) 
addHeadRoute({resourceName: String, initialValue: any, endPoint: String, serializer: Function, customActions: Array[String], customMutaions: Array[String]})
addOptionsRoute({resourceName: String, initialValue: any, endPoint: String, serializer: Function, customActions: Array[String], customMutaions: Array[String]}) 
addPostRoute({resourceName: String, initialValue: any, endPoint: String, serializer: Function, customActions: Array[String], customMutaions: Array[String]})
addPutRoute({resourceName: String, initialValue: any, endPoint: String, serializer: Function, customActions: Array[String], customMutaions: Array[String]})
addPatchRoute({resourceName: String, initialValue: any, endPoint: String, serializer: Function, customActions: Array[String], customMutaions: Array[String]}) 
```

Each function relates to one method in the API call.

### Parameters

`resourceName` -> will determine the name of the action, getter and data field

`initialValue` -> data in field on start

`endPoint` -> endPoint of the API (:variableName in the url will be replaced with a parameter of the same name when the created action is called)

`serializer` -> function called with response data, must return data in a new format

`customActions` -> array that contains the names of the actions to be called at the end of the fetching, they will be called with the result of the serializer as the payload

### Example 
```
addGetRoute({
  resourceName: 'userDetails',
  initialValue: [],
  endpoint: `http://api.github.com/repos/:userName/:repoName/contents/:location`,
  serializer: (response) => ({
    ...response,
  }),
});
```

## Using an action

Actions are created with the following name structure call method (get, post, etc.) + resourceName + 'Action'. So for a get request with the resource name `magicData` the action name is `getMagicDataAction`. This function is always async. After the function is called you can get the data from the fetch using one of the following getters.

`magicDataDataGetter` -> will return the data retuned by the serializer

`magicDataErrorGetter` -> will return the error (or `false`) in case the fetch failed for any reason

The getters are named resourceName + 'DataGetter' or resourceName + 'ErrorGetter'.

### Example

For the addGetRoute in the above example the action will look like this: 

```
const store = useStore();
await store.dispatch('getUserDetailsAction', {routeParams: {userName: 'abc', repoName: 'def', location: 'ghi'} })
console.log('data: ', store.getters.userDetailsDataGetter);
console.log('error: ', store.getters.userDetailsErrorGetter)
```

# Using Query Parameters

If you want to make a request using query params you can call any action and to the payload object add the queryParams field:

For example the following dispatch

`await store.dispatch('getUserDetailsAction', {routeParams: {userName: 'abc', repoName: 'def', location: 'ghi'}, queryParams: {q:'abc', q2:'efg'} })`

will result in the following call: 

`http://api.github.com/repos/abc/def/contents/ghi?q=abc&q2=efg`

# Post, Patch, Put

For these fetch methods your actions will require a data object to be send. Adding to the previous example:

`await store.dispatch('getUserDetailsAction', {routeParams: {userName: 'abc', repoName: 'def', location: 'ghi'}, queryParams: {q:'abc', q2:'efg'}, dataParams:{data:'data'} })`

# Everything created

So, in the end, this module creates the following elements for each fetch added: 

- an action that executes the fetch and uses the serializer to parse response data. This action's name is computed with the following formula:  `call method (get, post, etc.) + resourceName + 'Action'`
- a mutation for the resulting data named: `call method (get, post, etc.) + resourceName + 'Commit'`
- a mutation for the error (if any): `call method (get, post, etc.) + resourceName + 'ErrorCommit'`
- a getter for the data: `resource name + 'DataGetter'`
- a getter for the error: `resource name + 'ErrorGetter'`

## Dependecies

- Vuex
- Axios
