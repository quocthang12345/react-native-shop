import  React, { useState }  from "react";
import { FlatList, ScrollView,Image, StyleSheet, Text, View , TouchableOpacity, Button, TouchableHighlight} from 'react-native';
import axios from "axios"
import { useEffect } from "react";
import image from "../img/img";



export default function Cart({ navigation }){



    const [itemCart, setItemCart] = useState([]);
    

    useEffect(() => {
        axios.get("http://192.168.1.220:3000/cart").then(res => {
        setItemCart(res.data);
        }).catch(error => {
            console.log(error);
        })
    },[itemCart])


    const [totalPrice, setPrice] = useState(0);

    useEffect(() => {
        let sum = 0;
        itemCart.map(item => {
            sum +=  (parseInt(item.price.split('K')[0])*item.quantity);
        })
        setPrice(sum);
    },[itemCart])

    function updateQuantity(quantity,item){
        axios.put(`http://192.168.1.220:3000/cart/${item.id}/`,
        {
            ...item,
            quantity: quantity
        }
        ).then(res => {
            if(res.data.quantity < 1) {
                axios.delete(`http://192.168.1.220:3000/cart/${res.data.id}/`)
                .then()
                .catch(error => {
                    console.log(error);
                })
            }
        }).catch(error => {
            console.log(error);
        })
    }


    
    return(
        <View style={{position:"relative",height:"100%"}}> 
            <ScrollView style={styles.viewContainer}>
                {
                    itemCart.map(item => {
                        return(
                        <View style={styles.viewCart}>
                            <View style={styles.viewDescription}>
                                <Image source={image[item.img]} style={styles.viewImgProduct}/>
                                <View style={styles.viewPrice}>
                                    <Text>{item.itemName}</Text>
                                    <Text style={{color:"gray",opacity:"0.8"}}>{item.price}</Text>
                                </View>
                            </View>
                            <View style={styles.viewCount}>
                                <TouchableOpacity style={styles.buttonCount} onPress={() => {updateQuantity((item.quantity - 1),item)}}>
                                    <Text style={styles.textCountLeft}>-</Text>
                                </TouchableOpacity>
                                    <Text style={{marginHorizontal:10,fontWeight:"600",fontSize:16}}>{item.quantity}</Text>
                                <TouchableOpacity style={styles.buttonCount} onPress={() => {updateQuantity((item.quantity + 1),item)}}>
                                    <Text style={styles.textCountRight}>+</Text>
                                </TouchableOpacity>
                            </View>
                    </View>

                        )
                    })
                }
                
            </ScrollView>
            <View style={styles.viewPay} stickyHeaderIndices={[0]}>
                <View style={styles.viewTotal}>
                    <Text style={{fontSize:12,color:"gray"}}>Total</Text>
                    <Text style={{fontSize:24,fontWeight:"500"}}>{totalPrice + "K"}</Text>
                </View>
                <TouchableOpacity style={styles.buttonOrder}>
                        <Text style={{color:"#fff",fontSize:16,fontWeight:"400"}}>ORDER</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer: {
      flex:1,
    },
    viewCart:{
        backgroundColor:"#fff",
        zIndex:2,
        flexDirection:"row",
        justifyContent:"space-around",
        alignItems:"center",
        paddingVertical:16,
        shadowColor:"gray",
        shadowOpacity:0.5,
        shadowRadius:5,
        marginHorizontal:8,
        marginTop:16
    },
    viewDescription:{
        flexDirection:"row",
        justifyContent:"space-around",
        alignItems:"center"
    },
    viewImgProduct:{
        width:64,
        height:64,
        marginRight:15  
    },
    viewPrice:{
        flexDirection:"column",
        justifyContent:"space-between",
        fontFamily:"Arial",
        fontSize:20,
        fontStyle:"normal",
        height:40
    },
    viewCount:{
        flexDirection:"row",
        justifyContent:"space-around",
        alignItems:"center",
        height:50
    },
    buttonCount:{
        width:24,
        height:24,
        borderRadius:12,
        borderColor:"gray",
        borderWidth:1,
        backgroundColor:"gray",
        zIndex:2,
        position:"relative"
    },
    textCountLeft:{
        color:"#fff",
        fontSize:40,
        textAlign:"center",
        position:"absolute",
        top: -16,
        left: 2
    },
    textCountRight:{
        color:"#fff",
        fontSize:30,
        textAlign:"center",
        position:"absolute",
        top: -10,
        left: 2
    },
    viewPay:{
        backgroundColor:"#fff",
        // position:"sticky",
        bottom:0,
        left:0,
        right:0,
        width:"100%",
        zIndex:2,
        paddingVertical:16,
        flexDirection:"row",
        justifyContent:"space-around",
        alignItems:"center"
    },
    viewTotal:{
        flexDirection:"column",
        justifyContent:"space-around",
        height:50
    },
    buttonOrder:{
        paddingHorizontal:30,
        paddingVertical:8,
        // backgroundColor:rgb(98,164,212),
        backgroundColor:'rgb(50,143,171)',
        borderRadius:2
    }

  });
