/**
 *
 * Please note:
 * This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * Do not edit this file manually.
 *
 */

@file:Suppress(
    "ArrayInDataClass",
    "EnumEntryName",
    "RemoveRedundantQualifierName",
    "UnusedImport"
)

package org.openapitools.client.models


import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

/**
 * 
 *
 * @param CORE_PEER_LOCALMSPID Mapped to environment variables of the Fabric CLI container.
 * @param CORE_PEER_ADDRESS Mapped to environment variables of the Fabric CLI container.
 * @param CORE_PEER_MSPCONFIGPATH Mapped to environment variables of the Fabric CLI container.
 * @param CORE_PEER_TLS_ROOTCERT_FILE Mapped to environment variables of the Fabric CLI container.
 * @param ORDERER_TLS_ROOTCERT_FILE Mapped to environment variables of the Fabric CLI container.
 * @param transient Transient map of arguments in JSON encoding
 */


data class DeploymentTargetOrgFabric2x (

    /* Mapped to environment variables of the Fabric CLI container. */
    @Json(name = "CORE_PEER_LOCALMSPID")
    val CORE_PEER_LOCALMSPID: kotlin.String,

    /* Mapped to environment variables of the Fabric CLI container. */
    @Json(name = "CORE_PEER_ADDRESS")
    val CORE_PEER_ADDRESS: kotlin.String,

    /* Mapped to environment variables of the Fabric CLI container. */
    @Json(name = "CORE_PEER_MSPCONFIGPATH")
    val CORE_PEER_MSPCONFIGPATH: kotlin.String,

    /* Mapped to environment variables of the Fabric CLI container. */
    @Json(name = "CORE_PEER_TLS_ROOTCERT_FILE")
    val CORE_PEER_TLS_ROOTCERT_FILE: kotlin.String,

    /* Mapped to environment variables of the Fabric CLI container. */
    @Json(name = "ORDERER_TLS_ROOTCERT_FILE")
    val ORDERER_TLS_ROOTCERT_FILE: kotlin.String,

    /* Transient map of arguments in JSON encoding */
    @Json(name = "transient")
    val transient: kotlin.String? = null

)

