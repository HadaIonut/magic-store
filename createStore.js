import axios from "axios";

export let store = {}
const dataMethods = ['post', 'put', 'patch']

const initFields = ({mutations, actions, getters}) => {
  store['state'] = {}
  store['actions'] = {
    ...actions
  }
  store['mutations'] = {
    ...mutations
  }
  store['getters'] = {
    ...getters
  }
}

export const createStore = (customOperations) => initFields(customOperations);

const parseEndPoint = (rawURL, {routeParams, queryParams}) => {
  const parsedUrl = rawURL.replace(/:([\w]+)/g, (_, match) => routeParams[match]);
  const stringifiedQueryParams = Object.keys(queryParams || {}).reduce(
    (acc, current) => `${acc}&${current}=${queryParams[current]}`, '').substring(1);

  return queryParams ? `${parsedUrl}?${stringifiedQueryParams}` : `${parsedUrl}`
}

const callCustomEvents = async (customEvents, responseData, toCall) => {
  if (!customEvents) return;
  for (const customEvent of customEvents) {
    await toCall(customEvent, responseData)
  }
}

const getAction = (type, resourceName, rawUrl, serializer, customActions, customMutations) =>
  async ({commit, dispatch}, {routeParams, queryParams, dataParams}) => {
    console.log(rawUrl)
    try {
      const response = await axios({
        method: type,
        url: (routeParams || queryParams) ? parseEndPoint(rawUrl, {routeParams, queryParams}) : rawUrl,
        ...(dataMethods.includes(type) && {data: dataParams})
      })
      const responseData = typeof serializer === 'function' ? serializer(response.data) : response.data;
      commit(`${type}${resourceName}Commit`, responseData)

      await callCustomEvents(customActions, responseData, dispatch)
      await callCustomEvents(customMutations, responseData, commit)
    } catch (e) {
      commit(`${type}${resourceName}ErrorCommit`, {...e}?.response?.data || {...e})
    }
  }

const getMutation = (resourceName, type, method) => (state, payload) => {
  state[`${method}${resourceName}Entry`][type] = payload
}

const getGetter = (method, resourceName, field) => (state) => state[`${method}${resourceName}Entry`][field];

const addRoute = (type, {resourceName, initialValue, endpoint, serializer, customActions, customMutations}) => {
  const resourceNameModified = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);
  store.state[`${type}${resourceNameModified}Entry`] = {
    data: initialValue,
    error: false
  };
  store.actions[`${type}${resourceNameModified}Action`] = getAction(type, resourceNameModified, endpoint, serializer, customActions, customMutations);
  store.getters[`${resourceName}DataGetter`] = getGetter(type, resourceNameModified, 'data');
  store.getters[`${resourceName}ErrorGetter`] = getGetter(type, resourceNameModified, 'error');
  store.mutations[`${type}${resourceNameModified}Commit`] = getMutation(resourceNameModified, 'data', type);
  store.mutations[`${type}${resourceNameModified}ErrorCommit`] = getMutation(resourceNameModified, 'error', type);
}

export const addGetRoute = (data) => addRoute('get', data);
export const addDeleteRoute = (data) => addRoute('delete', data);
export const addHeadRoute = (data) => addRoute('head', data);
export const addOptionsRoute = (data) => addRoute('options', data);
export const addPostRoute = (data) => addRoute('post', data);
export const addPutRoute = (data) => addRoute('put', data);
export const addPatchRoute = (data) => addRoute('patch', data);