using UnityEngine;

public class Spinner : MonoBehaviour
{
    [SerializeField] float xAngle = 0f;
    [SerializeField] float yAngle = 0f;
    [SerializeField] float zAngle = 0f;
    
    void Update()
    {
        transform.Rotate(xAngle, yAngle, zAngle);
    }
}
