package com.crhistianm.galloalpha.data.response

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class ExerciseResponse (
    @SerialName("name") val exerciseName: String,
    @SerialName("description") val exerciseDescription: String,
    @SerialName("image_url") val imageUrl: String
)