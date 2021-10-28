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
addPostRoute({resourceName: String, initialValue: any, endPoint: String, serializer: Function, data: Object, customActions: Array[String], customMutaions: Array[String]})
addPutRoute({resourceName: String, initialValue: any, endPoint: String, serializer: Function, data: Object, customActions: Array[String], customMutaions: Array[String]})
addPatchRoute({resourceName: String, initialValue: any, endPoint: String, serializer: Function, data: Object, customActions: Array[String], customMutaions: Array[String]}) 
```
Each function relates to one method in the API call.

### Parameters
`resourceName` -> will determine the name of the action, getter and data field
`initialValue` -> data in field on start
`endPoint` -> endPoint of the API (:variableName in the url will be replaced with a parameter of the same name when the created action is called)
`serializer` -> function called with response data, must return data in a new format

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

## Dependecies

- Vuex
- Axios
