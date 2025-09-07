using UnityEngine;

public class Player : MonoBehaviour
{
    int collisionCount = 0;

    private void OnCollisionEnter(Collision other) 
    {
        if (other.gameObject.tag != "Hit")
        {
            collisionCount++;
            Debug.Log($"Player has collided with an object {collisionCount} times.");
        }        
    }
}
