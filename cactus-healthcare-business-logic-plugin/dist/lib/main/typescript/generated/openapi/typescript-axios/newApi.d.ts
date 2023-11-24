/**
 *
 * @export
 * @interface SourceRepository
 */
export interface SourceRepository {
    /**
     *
     * @type {string}
     * @memberof SourceRepository
     */
    'id': string;
    /**
     *
     * @type {string}
     * @memberof SourceRepository
     */
    'location': string;
    /**
     *
     * @type {string}
     * @memberof SourceRepository
     */
    'source': string;
}
/**
 *
 * @export
 * @interface DestinationRepository
 */
export interface DestinationRepository {
    /**
     *
     * @type {string}
     * @memberof DestinationRepository
     */
    'id': string;
    /**
     *
     * @type {string}
     * @memberof DestinationRepository
     */
    'location': string;
    /**
     *
     * @type {string}
     * @memberof DestinationRepository
     */
    'sourceRepositoryId': string;
}
