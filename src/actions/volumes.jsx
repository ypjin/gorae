/* global __API__ */
import docker from '../api/api';
// import axios from 'axios';

export const REQUEST_VOLUMES = 'REQUEST_VOLUMES';
export const RECEIVE_VOLUMES = 'RECEIVE_VOLUMES';
export const RECEIVE_VOLUMES_FAIL = 'RECEIVE_VOLUMES_FAIL';

export const VOLUME_FILTER_BY_NAME = 'VOLUME_FILTER_BY_NAME';

// const api = axios.create({
//   baseURL: __API__
// });

const requestVolumes = () => {
  return {
    type: REQUEST_VOLUMES
  };
};

const receiveVolumes = data => {
  return {
    type: RECEIVE_VOLUMES,
    volumes: data.Volumes,
    warnings: data.Warnings,
    receivedAt: Date.now()
  };
};

const fetchVolumesFail = () => ({
  type: RECEIVE_VOLUMES_FAIL
});

const _filterByName = name => ({
  type: VOLUME_FILTER_BY_NAME,
  name: name
})

export const filterByName = name => dispatch => {
  dispatch(_filterByName(name));
}

export const fetchVolumes = () => dispatch => {
  dispatch(requestVolumes());

  return docker.get('volumes')
    .then(response => {
      const {status, data} = response;

      if (status !== 200) {
        dispatch(fetchVolumesFail());
        return;
      }

      dispatch(receiveVolumes(data));
    });
};
