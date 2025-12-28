package com.crhistianm.galloalpha.view.core.components

import android.graphics.Paint
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.crhistianm.galloalpha.R

@Composable
fun GalloCard(
    modifier: Modifier = Modifier.size(400.dp, 100.dp),
    topText: String = "",
    bottomText: String = "",
    primaryText: String = "",
    imageUrl: String
) {
    Card (
        colors = CardDefaults.cardColors(
            containerColor = Color.Transparent,
            contentColor = Color.White
        ),
        modifier = modifier.background(
            alpha = 0.3f,
            brush = Brush.verticalGradient(listOf(Color.White, Color.Transparent)),
            shape = RoundedCornerShape(40f)
        )
            .border(
                width = 1.dp,
                shape = RoundedCornerShape(50f),
                color = Color.White.copy(alpha = 0.5f)
            )
    ) {
        Column {
            Row {
                Text(
                    modifier = Modifier.fillMaxWidth()
                        .padding(start = 10.dp),
                    text = topText,
                    textAlign = TextAlign.Start,
                    fontSize = 20.sp
                )
            }

            HorizontalDivider()

            Row {
                AsyncImage(
                    modifier = Modifier
                        .padding(top = 7.dp, start = 10.dp)
                        .size(50.dp)
                        .background(
                            shape = RoundedCornerShape(30f),
                            color = Color.White.copy(0.1f)
                        ),
                    model = imageUrl,
                    contentDescription = null,
                    onError = {
                    }
                )
                Column (
                    modifier = Modifier.padding(start = 100.dp)
                ){
                    Text(
                        text = primaryText,
                        fontSize = 14.sp,
                    )
                    Spacer(Modifier.height(10.dp))
                    Row {
                        Icon(painter = painterResource(R.drawable.icon_time), contentDescription = null, tint = Color.Gray)
                        Text(text = " $bottomText", fontSize = 18.sp, color = Color.Gray)
                    }
                }
            }
        }
    }
}

@Composable
@Preview
private fun GalloCardPreview(){
    GalloCard (
        modifier = Modifier
            .width(200.dp)
            .height(50.dp),
        primaryText = "Top",
        imageUrl = "https://avatars.githubusercontent.com/u/106357444?s=48&v=4"
    )
}
