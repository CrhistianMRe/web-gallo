package com.crhistianm.galloalpha.view.core.navigation

import androidx.compose.runtime.Composable
import androidx.navigation3.runtime.entryProvider
import androidx.navigation3.runtime.rememberNavBackStack
import androidx.navigation3.ui.NavDisplay
import com.crhistianm.galloalpha.view.core.navigation.Screens.WorkoutList
import com.crhistianm.galloalpha.view.core.navigation.Screens.ExerciseList
import com.crhistianm.galloalpha.view.persistence.load.ExerciseListScreen
import com.crhistianm.galloalpha.view.persistence.load.WorkoutListScreen

@Composable
fun NavigationWrapper() {
    val backStack = rememberNavBackStack(ExerciseList)


    //Navegacion es como un bean o dependencia, solo tiene la logica de navegar
    // por eso se inicializa el viewModel en la screen
    // Seria por modulos: (Navegacion -> Screen) y (Repo → Dominio (UseCases) → ViewModel → Screen)
    // Recorda que jetpack funciona por recomposicion. La screen escucha eventos y los hace segun las dependencias que tenga
    NavDisplay(
        backStack = backStack,
        onBack = { backStack.removeLastOrNull() },
        entryProvider = entryProvider {
            entry <WorkoutList> {
                WorkoutListScreen() {
                    backStack.removeLastOrNull()
                    backStack.add(ExerciseList)
                }
            }
            entry<ExerciseList>{
                ExerciseListScreen() {
                    backStack.removeLastOrNull()
                    backStack.add(WorkoutList)
                }
            }
        }

    )


}