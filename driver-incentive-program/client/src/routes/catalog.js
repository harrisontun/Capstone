import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as FaIcons from "react-icons/fa";

function Catalog() {

    var totalPoints = 0;
    var user_id = window.sessionStorage.getItem("user_id");
    var userPoints = window.sessionStorage.getItem("points");
    const [PointsAmt, setPointsAmt] = useState('');
    const [total, settotal] = useState('');
    const [quantityAmt, setQuantityAmt] = useState('');
    const [item, setItem] = useState('');

    const [points, setPoints] = useState(''); // points from a specific org.
    const [searchTerm, setSearchTerm] = useState('');
    const [catalog, renderCatalog] = useState([]);
    const [isToggled, setIsToggled] = useState(false);
    const [sponsorInfo, setSponsorInfo] = useState([]);
    const [sponsor, setSponsor] = useState('');

    useEffect( () => {
        let url = 'http://54.234.98.88:8000/driver/currentSponsors/' + user_id;
            const sponsList = async() => {
                axios.get(url)
                .then(res => setSponsorInfo(res.data))
                .catch((err) => console.log(err));
            }
            sponsList();
    }, [user_id])

    useEffect( () => {
        let url = 'http://54.234.98.88:8000/driver/points/' + user_id +'/' + sponsor;
            const pointsFromSpons = async() => {
                axios.get(url)
                .then(res => {
                    let pnts = res.data;
                    setPoints(pnts[0].points)})
                .catch((err) => console.log(err));
            }
            pointsFromSpons();
    }, [sponsor])


    const modPoints = () => {
        axios.post('http://54.234.98.88:8000/modPoints', {
        user_id: user_id,
        PointsAmt: totalPoints
        }).then(res => {
            console.log(res);
            sessionStorage.setItem("points", res.data[0].points);
            window.location.reload();
        //.catch(err => console.log(err));
    })};

    const favorite = () => {
        setIsToggled(!isToggled);
    };

    const searchITUNES = () => {
        
        //Checking for a valid search
        if (!searchTerm || searchTerm === '') {
            alert('Please Enter Valid Search');
        } else {
            const URL = `https://itunes.apple.com/search?term=${searchTerm}`;
            fetch(URL)
                .then((response) => response.json())
                .then((data) => {
                    renderCatalog(data.results);
                })
        }
    }

    const removeCartItem = (event) => {
        var buttonClicked = event.target;
        buttonClicked.parentElement.parentElement.remove();
        buttonClicked.parentElement.remove();
        updateCart();
    }

    const addToCart = (artwork, title, price) => {
        setItem(title);
        var cartRow = document.createElement('div');
        cartRow.classList.add('cart-row');
        var cartItems = document.getElementsByClassName('cart-items')[0]
        var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
        for (var i = 0; i < cartItemNames.length; i++) {
            if (cartItemNames[i].innerText === title) {
                alert('This item is already added to the cart');
                return;
            }
        }
        var cartRowContents = `
            <div class="cart-item cart-column">
                <img class="cart-item-image" src="${artwork}" width="100" height="100">
                <span class="cart-item-title">${title}</span>
            </div>
            <span class="cart-price cart-column">${price}</span>
            <div class="cart-quantity cart-column">
                <input class="cart-quantity-input" type="number" value="1">
                <button class="btn btn-danger" type="button">REMOVE</button>
            </div>`
            
        cartRow.innerHTML = cartRowContents;
        cartItems.append(cartRow);

        cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
        cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantity)
        updateCart();
        
    }

    function quantity(amount) {

        var input = amount.target;
        if (isNaN(input.value) || input.value <= 0) {
            input.value = 1;
        }

        setQuantityAmt(amount);
        updateCart();
    }

    const moneyToPoints = (amount) => {
        var points = amount * 100;
        return Math.ceil(points);
    }

    const purchaseItems = () => {

        if (userPoints >= totalPoints) {
            totalPoints = '-' + totalPoints;
            console.log(totalPoints);
            settotal(totalPoints);
            setPointsAmt(totalPoints);
            modPoints();
            alert('Thank you for your purchase');
            var cartItems = document.getElementsByClassName('cart-items')[0];
            while (cartItems.hasChildNodes()) {
                cartItems.removeChild(cartItems.firstChild);
            }
            updateCart();
        } else {
            alert('You do not have enough points to purchase the item(s) in your cart');
        }

        axios.post('http://54.234.98.88:8000/purchaseHistory/order', {
            user_id: user_id,
            total: total,
            quantityAmt: quantityAmt,
            item: item
        }).then(res => {
            console.log(res);
        }).catch(err => {
            console.error('Error submitting application/:', err);
        });
    }

    const updateCart = () => {
        var cartItemContainer = document.getElementsByClassName('cart-items')[0];
        var cartRows = cartItemContainer.getElementsByClassName('cart-row');
        totalPoints = 0;
        for (var i = 0; i < cartRows.length; i++) {
            var cartRow = cartRows[i];
            var priceElement = cartRow.getElementsByClassName('cart-price')[0];
            var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
            var price = parseFloat(priceElement.innerHTML);
            var quantity = quantityElement.value;
            totalPoints = totalPoints + (price * quantity);
        }
        document.getElementsByClassName('cart-total-price')[0].innerText = totalPoints;
    }

    return (
        <div className="catalog-container">
            
            <section className="catalog">
                <h1>CATALOG</h1>
                <label htmlFor='sponsor'> Select Sponsor: </label>
                <select name="sponsor" placeholder='Sponsor' required onChange={e => setSponsor(e.target.value)}>
                        <option value={-1}> </option>
                        {sponsorInfo.map((info) => <option key= {info.SponsorID} value={info.SponsorID}>{info.Name}</option>)}
                </select>
                <h3>POINTS: { points }</h3>
                <input type="text" placeholder="Search" onChange={e => setSearchTerm(e.target.value)}></input>
                <button className="btn" onClick={(() => searchITUNES() )}>Search</button>

                {catalog.length && (
                    <table>
                    <thead>
                        <tr>
                        <th>Artwork</th>
                        <th>Artist Name</th>
                        <th>Track Name</th>
                        <th>Points</th>
                        <th>Add to Cart</th>
                        <th>Favorite</th>
                        </tr>
                    </thead>
                        <tbody>
                        {catalog.map((i) => {
                            const list = (
                            <>
                                <tr>
                                <td><img src={i.artworkUrl60} alt={i.artistName} /></td>
                                <td key={i.artistId}>{i.artistName}</td>
                                <td>{i.trackCensoredName}</td>
                                <td>{moneyToPoints(i.collectionPrice)}</td>
                                <td><button onClick={(() => addToCart(i.artworkUrl60, i.artistName, moneyToPoints(i.collectionPrice)) )}>+</button></td>
                                <td>{isToggled ? (<FaIcons.FaHeart onClick={favorite} />) : (<FaIcons.FaRegHeart onClick={favorite} />)}
                                </td>
                                </tr>
                            </>
                            );
                            return list;
                        })}
                        </tbody>
                    </table>
                )}

            </section>

            <section class="cart">
                <h2 class="section-header">CART</h2>
                <div class="cart-row">
                    <span class="cart-item cart-header cart-column">Item</span>
                    <span class="cart-item cart-header cart-column">Name</span>
                    <span class="cart-price cart-header cart-column">Points</span>
                    <span class="cart-quantity cart-header cart-column">Quantity</span>
                </div>
                <div class="cart-items">
                </div>
                <div class="cart-total">
                    <strong class="cart-total-title">Total</strong>
                    <span class="cart-total-price">0</span>
                </div>
                <button class="btn btn-primary btn-purchase" type="button" onClick={(() => purchaseItems())}>PURCHASE</button>
            </section>

        </div>
    )
}

export default Catalog;