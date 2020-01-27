import React from 'react';
import { func } from 'prop-types';

import {
  Heading,
  Sublabel,
  Divider,
  Icon,
  InputGroup,
  InputGroupPrepend,
  InputGroupAddon,
  TextInput,
  BodyText,
} from '<private_library>';

import { designsAxios } from '#src/utils/requests';

import { API_URLS } from '../../config';
import { validateString } from '../../helper';
import Loader from '../../Loader';

const FETCHING_LIMIT = 20;

const DEFAULT_NEIGHBORHOODS_RES = {
  data: [],
  meta: {
    total: 0,
    count: 0,
  },
  total: 0,
};

class SelectNeighborhood extends React.Component {
  state = {
    isSearching: true,
    isFetching: false,
    isLoadingMore: false,

    neighborhoods: [],
    neighborhood: {},
    search: '',

    offset: 0,
    total: 0,
  };

  /* Handle Timeout > Search Neighbrohood */
  searchNeighborhoodsTimeout = null;

  /**
   * Handle API Error
   */
  handleError = () => {
    this.setState({
      isFetching: false,
      isSearching: false,
      isLoadingMore: false,
    });
  };

  /**
   * Get Neighborhoods from API
   */
  fetchNeighborhoods = () => {
    const { offset, neighborhoods, total, search, isLoadingMore } = this.state;

    const url = `${API_URLS.BOUNDARIES.GET_BOUNDARIES_VIA_AREA}?filter[boundary_type]=neighborhood&page[limit]=${FETCHING_LIMIT}&page[offset]=${offset}&q=${search}`;

    if (!total || total > neighborhoods.length) {
      if (!isLoadingMore) this.setState({ isFetching: true });

      designsAxios
        .get('fetchNeighborhoods')(url)
        .then(({ data: res = {} }) => {
          const {
            data = DEFAULT_NEIGHBORHOODS_RES.data,
            meta = DEFAULT_NEIGHBORHOODS_RES.meta,
          } = res;

          this.setState({
            neighborhoods: [...neighborhoods, ...data],
            isFetching: false,
            isSearching: false,
            isLoadingMore: false,
            total: meta.total || DEFAULT_NEIGHBORHOODS_RES.total,
          });
        }, this.handleError);
    }
  };

  /**
   * Load more Neighborhoods
   */
  loadMoreNeighborhoods = () => {
    const { isFetching, offset } = this.state;

    if (isFetching) return;

    this.setState(
      {
        offset: offset + FETCHING_LIMIT,
        isLoadingMore: true,
      },
      this.fetchNeighborhoods
    );
  };

  /**
   * Handle Search Neighborhoods
   *
   * @param {String} name
   * @param {String} value
   */
  handleSearchNeighborhoods = (name, value) => {
    if (this.searchNeighborhoodsTimeout) {
      clearTimeout(this.searchNeighborhoodsTimeout);
    }

    this.setState({
      isSearching: true,
      search: value,
      offset: 0,
      total: 0,
      neighborhoods: [],
    });

    this.searchNeighborhoodsTimeout = setTimeout(this.fetchNeighborhoods, 1500);
  };

  /**
   * Handle Selected Neighborhood
   */
  initNeighborhoodSelectHandle = neighborhood => () => {
    this.setState({ neighborhood });
    this.props.handleSelectedNeighborhood(neighborhood);
  };

  render() {
    const {
      isFetching,
      neighborhood,
      neighborhoods,
      search,
      isSearching,
      isLoadingMore,
      total,
    } = this.state;

    return (
      <>
        <Loader isLoading={isFetching} />
        {/* Select Neighborhood */}
        <div className="form-field-wrap mb-4">
          <Heading as="h4" className="mb-4">
            Select Neighborhood
          </Heading>
          <InputGroup className="mb-4">
            <InputGroupPrepend>
              <InputGroupAddon>
                <Icon className="text-neutral03" icon="search" />
              </InputGroupAddon>
            </InputGroupPrepend>
            <TextInput
              name="search"
              value={search}
              className="pl-1"
              placeholder="Search Neighborhoods..."
              onChange={this.handleSearchNeighborhoods}
            />
          </InputGroup>
        </div>
        {!isFetching && !isSearching && neighborhoods.length === 0 && (
          <Heading as="h4" className="text-center py-4">
            No records found!
          </Heading>
        )}
        {/* List of Neighborhood */}
        {!isFetching &&
          neighborhoods.length > 0 &&
          neighborhoods.map((nh, i) => {
            return (
              <div key={nh.id}>
                {i !== 0 && <Divider className="border-neutral06" />}

                <div
                  className="px-2 py-1 cursor-pointer"
                  onClick={this.initNeighborhoodSelectHandle(nh)}
                >
                  <Heading
                    as="h4"
                    className="d-flex align-items-center justify-content-between"
                  >
                    {nh.attributes.neighborhood_name}
                    {nh.id === neighborhood.id && (
                      <Icon
                        icon="checkmark"
                        size="small"
                        className="text-blue ml-2"
                      />
                    )}
                  </Heading>
                  <Sublabel className="py-1">
                    {`${validateString(
                      nh.attributes.city,
                      '--'
                    )}, ${validateString(
                      nh.attributes.state_or_province,
                      '--'
                    )}, ${validateString(nh.attributes.country, '--')}`}
                  </Sublabel>
                </div>
              </div>
            );
          })}
        <div className="text-center py-3">
          {!isLoadingMore &&
            neighborhoods.length > 0 &&
            neighborhoods.length < total && (
              <BodyText
                className="link d-inline-block"
                onClick={this.loadMoreNeighborhoods}
              >
                Load more
              </BodyText>
            )}
          {isLoadingMore && <BodyText>Loading...</BodyText>}
        </div>
      </>
    );
  }
}

SelectNeighborhood.propTypes = {
  handleSelectedNeighborhood: func.isRequired,
};

SelectNeighborhood.defaultProps = {
  handleSelectedNeighborhood: () => {},
};

export default SelectNeighborhood;
