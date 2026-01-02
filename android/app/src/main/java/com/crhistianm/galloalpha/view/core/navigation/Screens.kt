package com.crhistianm.galloalpha.view.core.navigation

import androidx.navigation3.runtime.NavKey
import kotlinx.serialization.Serializable

sealed class Screens: NavKey {

    @Serializable
    object WorkoutList: Screens()

    @Serializable
    object ExerciseList: Screens()
}
