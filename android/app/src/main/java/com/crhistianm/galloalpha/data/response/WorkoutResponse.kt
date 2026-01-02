package com.crhistianm.galloalpha.data.response

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class WorkoutResponse (
    @SerialName("exercise_name") val exerciseName: String,
    @SerialName("workout_date") val workoutDate: String,
    @SerialName("image_url") val imageUrl: String,
    @SerialName("workout_length") val workoutLength: String
)
